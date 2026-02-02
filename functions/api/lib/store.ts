import type { Room, RoomCode, RoomEvent, AssignedMission } from "./types.ts";
import { MAX_EVENTS } from "./types.ts";
import { PERSONAL_MISSION_COUNT } from "./constants.ts";
import { MISSION_DECK } from "./missions.ts";
import { hashStringToUint32, mulberry32, shuffleWithSeed } from "./random.ts";
import { computePlayerScore } from "./scoring.ts";
import { displayNameFromEmail } from "./headers.ts";
import { generateRoomCode } from "./validate.ts";
import { badRequest, conflict, forbidden, notFound } from "./errors.ts";

/** Minimal KV interface so store can be tested without CF globals. */
export interface KVStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

const ROOM_PREFIX = "room:";
const DECK_BY_ID = new Map(MISSION_DECK.map((m) => [m.id, m]));

function roomKey(code: RoomCode): string {
  return ROOM_PREFIX + code;
}

async function getRoomFromKV(kv: KVStore, code: RoomCode): Promise<Room | null> {
  const raw = await kv.get(roomKey(code));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Room;
  } catch {
    return null;
  }
}

async function putRoomToKV(kv: KVStore, room: Room): Promise<void> {
  await kv.put(roomKey(room.code), JSON.stringify(room));
}

function addEvent(room: Room, type: RoomEvent["type"], by: string, meta?: RoomEvent["meta"]): void {
  room.events.push({
    at: Date.now(),
    type,
    by,
    meta,
  });
  if (room.events.length > MAX_EVENTS) {
    room.events = room.events.slice(-MAX_EVENTS);
  }
}

async function createRoomCode(kv: KVStore, _name: string): Promise<RoomCode> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = generateRoomCode();
    const existing = await getRoomFromKV(kv, code);
    if (!existing) return code;
  }
  throw conflict("Could not generate unique room code; try again.");
}

/** Pick common mission for room using room code as seed. */
function pickCommonMission(code: RoomCode): string {
  const seed = hashStringToUint32(code);
  const rng = mulberry32(seed);
  const i = Math.floor(rng() * MISSION_DECK.length);
  return MISSION_DECK[i].id;
}

/** Assign 1 common + PERSONAL_MISSION_COUNT personal missions to a player. Deterministic by code:commonMissionId:email. */
function buildAssignedMissions(code: RoomCode, commonMissionId: string, email: string): AssignedMission[] {
  const seedStr = `${code}:${commonMissionId}:${email}`;
  const seed = hashStringToUint32(seedStr);
  const rng = mulberry32(seed);
  const rest = MISSION_DECK.filter((m) => m.id !== commonMissionId);
  const shuffled = shuffleWithSeed(rest, rng);
  const personalIds = shuffled.slice(0, PERSONAL_MISSION_COUNT).map((m) => m.id);
  const common: AssignedMission = { missionId: commonMissionId, status: "pending" };
  const personal: AssignedMission[] = personalIds.map((id) => ({ missionId: id, status: "pending" }));
  return [common, ...personal];
}

/**
 * Create a new room and add the creator as first player. Picks common mission; assigns creator's missions.
 */
export async function createRoom(
  kv: KVStore,
  name: string,
  creatorEmail: string
): Promise<{ code: RoomCode; name: string }> {
  const code = await createRoomCode(kv, name);
  const commonMissionId = pickCommonMission(code);
  const now = Date.now();
  const displayName = displayNameFromEmail(creatorEmail);
  const assignedMissions = buildAssignedMissions(code, commonMissionId, creatorEmail);
  const room: Room = {
    code,
    name,
    createdAt: now,
    creatorEmail,
    isClosed: false,
    commonMissionId,
    missionDeckVersion: "v1",
    players: {
      [creatorEmail]: {
        email: creatorEmail,
        displayName,
        score: 0,
        joinedAt: now,
        assignedMissions,
      },
    },
    events: [],
  };
  addEvent(room, "joined", creatorEmail);
  await putRoomToKV(kv, room);
  return { code, name };
}

/**
 * Join a room by code. Fails if room is closed or not found. Assigns 6 missions (1 common + 5 personal).
 */
export async function joinRoom(kv: KVStore, code: RoomCode, email: string): Promise<void> {
  const room = await getRoomFromKV(kv, code);
  if (!room) throw notFound("Room not found");
  if (room.isClosed) throw conflict("Room is closed");
  if (room.players[email]) return; // already in room
  const displayName = displayNameFromEmail(email);
  const assignedMissions = buildAssignedMissions(room.code, room.commonMissionId, email);
  room.players[email] = {
    email,
    displayName,
    score: 0,
    joinedAt: Date.now(),
    assignedMissions,
  };
  addEvent(room, "joined", email);
  await putRoomToKV(kv, room);
}

/**
 * Remove a player from the room. If no players remain, close the room.
 */
export async function leaveRoom(kv: KVStore, code: RoomCode, email: string): Promise<void> {
  const room = await getRoomFromKV(kv, code);
  if (!room) throw notFound("Room not found");
  if (!room.players[email]) return;
  delete room.players[email];
  addEvent(room, "left", email);
  if (Object.keys(room.players).length === 0) {
    room.isClosed = true;
    addEvent(room, "closed", email);
  }
  await putRoomToKV(kv, room);
}

export type MissionStatus = import("./types.ts").MissionStatus;

/**
 * Set mission outcome for the caller: succeeded, failed, or reset to pending. Optional targetEmail = other player this mission was for.
 * Recomputes score (only succeeded counts).
 */
export async function setMissionStatus(
  kv: KVStore,
  code: RoomCode,
  email: string,
  missionId: string,
  status: MissionStatus,
  targetEmail?: string
): Promise<void> {
  const room = await getRoomFromKV(kv, code);
  if (!room) throw notFound("Room not found");
  if (room.isClosed) throw conflict("Room is closed");
  const player = room.players[email];
  if (!player) throw forbidden("You are not in this room");
  const assignment = player.assignedMissions.find((a) => a.missionId === missionId);
  if (!assignment) throw forbidden("Mission not assigned to you");
  if (targetEmail !== undefined && targetEmail !== "") {
    if (targetEmail === email) throw badRequest("Target cannot be yourself");
    if (!room.players[targetEmail]) throw badRequest("Target must be a player in this room");
  }
  assignment.status = status;
  assignment.completedAt = status !== "pending" ? Date.now() : undefined;
  assignment.targetEmail = status !== "pending" && targetEmail ? targetEmail : undefined;
  player.score = computePlayerScore(player.assignedMissions, DECK_BY_ID);
  const mission = DECK_BY_ID.get(missionId);
  const points = mission?.points ?? 0;
  const eventType =
    status === "succeeded" ? "mission_succeeded" : status === "failed" ? "mission_failed" : "mission_reset";
  const targetDisplayName =
    targetEmail && room.players[targetEmail] ? room.players[targetEmail].displayName : undefined;
  addEvent(room, eventType, email, {
    missionId,
    points,
    status,
    targetEmail: targetEmail || undefined,
    targetDisplayName,
  });
  await putRoomToKV(kv, room);
}

/**
 * Return missions data for the caller only: common mission, personal missions, statuses, computed score.
 * Other players' missions are never returned; call with the authenticated user's email.
 */
export async function getMissionsData(
  kv: KVStore,
  code: RoomCode,
  email: string
): Promise<{
  commonMission: {
    mission: (typeof MISSION_DECK)[0];
    status: import("./types.ts").MissionStatus;
    completedAt?: number;
    targetEmail?: string;
    targetDisplayName?: string;
  };
  personalMissions: Array<{
    mission: (typeof MISSION_DECK)[0];
    status: import("./types.ts").MissionStatus;
    completedAt?: number;
    targetEmail?: string;
    targetDisplayName?: string;
  }>;
  score: number;
}> {
  const room = await getRoomFromKV(kv, code);
  if (!room) throw notFound("Room not found");
  const player = room.players[email];
  if (!player) throw forbidden("You are not in this room");
  const score = computePlayerScore(player.assignedMissions, DECK_BY_ID);
  const commonMission = DECK_BY_ID.get(room.commonMissionId);
  if (!commonMission) throw notFound("Common mission not found");
  const commonAssignment = player.assignedMissions.find((a) => a.missionId === room.commonMissionId);
  const personalAssignments = player.assignedMissions.filter((a) => a.missionId !== room.commonMissionId);
  const withTarget = (
    a: AssignedMission,
    _mission: (typeof MISSION_DECK)[0]
  ): { targetEmail?: string; targetDisplayName?: string } => {
    if (!a.targetEmail) return {};
    const target = room.players[a.targetEmail];
    return {
      targetEmail: a.targetEmail,
      targetDisplayName: target?.displayName,
    };
  };
  const personalMissions = personalAssignments
    .map((a) => {
      const mission = DECK_BY_ID.get(a.missionId);
      return mission
        ? {
            mission,
            status: a.status,
            completedAt: a.completedAt,
            ...withTarget(a, mission),
          }
        : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  return {
    commonMission: {
      mission: commonMission,
      status: commonAssignment ? commonAssignment.status : "pending",
      completedAt: commonAssignment?.completedAt,
      ...(commonAssignment ? withTarget(commonAssignment, commonMission) : {}),
    },
    personalMissions,
    score,
  };
}

/**
 * Close the room. Creator only.
 */
export async function closeRoom(kv: KVStore, code: RoomCode, email: string): Promise<void> {
  const room = await getRoomFromKV(kv, code);
  if (!room) throw notFound("Room not found");
  if (room.creatorEmail !== email) {
    throw forbidden("Only the room creator can close the room");
  }
  if (room.isClosed) return;
  room.isClosed = true;
  addEvent(room, "closed", email);
  await putRoomToKV(kv, room);
}

/**
 * Return sanitized room state. Ranking uses computed scores from missions.
 */
export async function getRoomState(
  kv: KVStore,
  code: RoomCode,
  email: string
): Promise<{
  room: { code: RoomCode; name: string; createdAt: number; creatorEmail: string; isClosed: boolean };
  you: { email: string; displayName: string; score: number; isCreator: boolean } | null;
  players: Array<{ email: string; displayName: string; score: number }>;
  ranking: Array<{ rank: number; email: string; displayName: string; score: number }>;
  events: RoomEvent[];
}> {
  const room = await getRoomFromKV(kv, code);
  if (!room) throw notFound("Room not found");

  const players = Object.values(room.players).map((p) => ({
    ...p,
    score: computePlayerScore(p.assignedMissions, DECK_BY_ID),
  }));
  const ranking = [...players]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.joinedAt - b.joinedAt;
    })
    .map((p, i) => ({
      rank: i + 1,
      email: p.email,
      displayName: p.displayName,
      score: p.score,
    }));

  const me = room.players[email] ?? null;
  const you = me
    ? {
        email: me.email,
        displayName: me.displayName,
        score: computePlayerScore(me.assignedMissions, DECK_BY_ID),
        isCreator: room.creatorEmail === email,
      }
    : null;

  // Sanitize events: strip missionId from mission events so players cannot see which mission others completed
  const missionEventTypes: RoomEvent["type"][] = ["mission_succeeded", "mission_failed", "mission_reset"];
  const sanitizedEvents = [...room.events]
    .reverse()
    .map((e) => {
      if (missionEventTypes.includes(e.type) && e.meta && "missionId" in e.meta) {
        const { missionId: _omit, ...restMeta } = e.meta;
        return { ...e, meta: restMeta };
      }
      return e;
    });

  return {
    room: {
      code: room.code,
      name: room.name,
      createdAt: room.createdAt,
      creatorEmail: room.creatorEmail,
      isClosed: room.isClosed,
    },
    you: you ?? null,
    players: players.map((p) => ({ email: p.email, displayName: p.displayName, score: p.score })),
    ranking,
    events: sanitizedEvents,
  };
}
