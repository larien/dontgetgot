var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-4CFZeM/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/pages-WtIopS/functionsWorker-0.72312783353131.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var urls2 = /* @__PURE__ */ new Set();
function checkURL2(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls2.has(url.toString())) {
      urls2.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL2, "checkURL");
__name2(checkURL2, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL2(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});
function badRequest(message) {
  return { status: 400, code: "BAD_REQUEST", message };
}
__name(badRequest, "badRequest");
__name2(badRequest, "badRequest");
function unauthorized(message) {
  return { status: 401, code: "UNAUTHORIZED", message };
}
__name(unauthorized, "unauthorized");
__name2(unauthorized, "unauthorized");
function forbidden(message) {
  return { status: 403, code: "FORBIDDEN", message };
}
__name(forbidden, "forbidden");
__name2(forbidden, "forbidden");
function notFound(message) {
  return { status: 404, code: "NOT_FOUND", message };
}
__name(notFound, "notFound");
__name2(notFound, "notFound");
function conflict(message) {
  return { status: 409, code: "CONFLICT", message };
}
__name(conflict, "conflict");
__name2(conflict, "conflict");
var USER_IDENTITY_HEADER = "X-User-Identity";
function getUserEmail(request) {
  const identity = request.headers.get(USER_IDENTITY_HEADER)?.trim();
  if (!identity) {
    throw unauthorized(
      "Identity required. Enter your name, nickname, or email on the login page."
    );
  }
  return identity;
}
__name(getUserEmail, "getUserEmail");
__name2(getUserEmail, "getUserEmail");
function displayNameFromEmail(identity) {
  const trimmed = identity.trim();
  if (!trimmed.includes("@")) return trimmed.slice(0, 64) || "Player";
  const local = trimmed.split("@")[0] ?? trimmed;
  const words = local.replace(/[._]/g, " ").split(/\s+/).filter(Boolean);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ").trim().slice(0, 64) || local.slice(0, 64) || "Player";
}
__name(displayNameFromEmail, "displayNameFromEmail");
__name2(displayNameFromEmail, "displayNameFromEmail");
async function readJson(request) {
  const text = await request.text();
  if (!text.trim()) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    throw { status: 400, code: "INVALID_JSON", message: "Invalid JSON body" };
  }
}
__name(readJson, "readJson");
__name2(readJson, "readJson");
var JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*"
};
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS
  });
}
__name(jsonResponse, "jsonResponse");
__name2(jsonResponse, "jsonResponse");
function errorResponse(err) {
  return jsonResponse(
    { ok: false, error: { code: err.code, message: err.message } },
    err.status
  );
}
__name(errorResponse, "errorResponse");
__name2(errorResponse, "errorResponse");
function isAppError(err) {
  return typeof err === "object" && err !== null && "status" in err && "code" in err && "message" in err;
}
__name(isAppError, "isAppError");
__name2(isAppError, "isAppError");
function handleError(err) {
  if (isAppError(err)) return errorResponse(err);
  throw err;
}
__name(handleError, "handleError");
__name2(handleError, "handleError");
var MAX_EVENTS = 50;
var PERSONAL_MISSION_COUNT = 5;
var MISSION_DECK = [
  { id: "m001", title: "Set up a casual chat where numbers or a quick calculation come up.", points: 2, difficulty: "easy", tags: ["irl"] },
  { id: "m002", title: "Create a moment where a fact (place, date, name) feels relevant and you're both sure of your version.", points: 2, difficulty: "easy", tags: ["irl"] },
  { id: "m003", title: "Get into a conversation where wording and how you say things matter.", points: 2, difficulty: "easy", tags: ["irl"] },
  { id: "m004", title: "Weave a song or artist into the vibe, then let it reappear in the room later.", points: 3, difficulty: "hard", tags: ["irl"] },
  { id: "m005", title: "Steer things toward recommendations\u2014shows, spots, food\u2014and see who takes the bait.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m006", title: "Say something with quiet confidence that invites a gentle correction.", points: 2, difficulty: "easy", tags: ["irl"] },
  { id: "m007", title: "Start a thought and leave it hanging so someone else can complete it.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m008", title: "Drop a line that's just odd enough that someone has to double-take.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m009", title: "Create a moment where your posture or stance is contagious.", points: 3, difficulty: "hard", tags: ["irl"] },
  { id: "m010", title: "Lead the discussion to a point where agreement feels natural.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m011", title: "Set the scene for a small celebratory gesture\u2014a win, a joke, a plan\u2014and see who joins in.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m012", title: "Bring hunger or thirst into the mix and see who suggests fixing it together.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m013", title: "Get into a situation where using each other's names feels natural.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m014", title: "Share something personal enough that 'same' or 'me too' is a natural reply.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m015", title: "Create a moment where you're on a call and need a hand with a number.", points: 3, difficulty: "hard", tags: ["irl"] },
  { id: "m016", title: "Float an opinion and leave a beat for someone to align with it first.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m017", title: "Say something that almost demands a follow-up question.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m018", title: "Share something worth passing on and give them a reason to tell someone else.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m019", title: "Explain something simply and leave room for them to signal they've got it.", points: 2, difficulty: "easy", tags: ["irl"] },
  { id: "m020", title: "Create a situation where a knot\u2014literal or figurative\u2014is the obvious next step.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m021", title: "Set up a moment where you and they might say the same thing at the same time.", points: 3, difficulty: "hard", tags: ["irl"] },
  { id: "m022", title: "Let the vibe be good and leave the 'we should do this again' to someone else.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m023", title: "Introduce a small physical quirk and see who tries to help.", points: 3, difficulty: "hard", tags: ["irl"] },
  { id: "m024", title: "Ask a question that feels genuine and worth a considered answer.", points: 2, difficulty: "easy", tags: ["irl"] },
  { id: "m025", title: "Ask something they might not know and leave space for an honest answer.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m026", title: "Put yourself near someone new and create a natural opening for an intro.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m027", title: "Be present and warm; leave it to them to suggest doing it again.", points: 3, difficulty: "hard", tags: ["irl"] },
  { id: "m028", title: "Bring up a topic that leads naturally to 'let me show you'.", points: 2, difficulty: "easy", tags: ["irl"] },
  { id: "m029", title: "Create a reason they'd want to follow up with you later.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m030", title: "Do something small and useful and see if it gets acknowledged.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m031", title: "Casually bring direction or orientation into the conversation.", points: 3, difficulty: "hard", tags: ["irl"] },
  { id: "m032", title: "Create a moment where they're tempted to test something you've said about an object.", points: 4, difficulty: "legendary", tags: ["irl"] },
  { id: "m033", title: "Raise a topic that's easy to put off until later.", points: 3, difficulty: "hard", tags: ["irl"] },
  { id: "m034", title: "Wind down a thread in a way that invites a 'later' or 'next time'.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m035", title: "Mention something you'd want to remember or have sent\u2014and leave the offer to them.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m036", title: "Create a natural pause that invites a deeper question.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m037", title: "Hint at time or tiredness and see who mirrors it.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m038", title: "Suggest the group might want a change of scene without proposing where.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m039", title: "Act a bit out of your depth and see who offers to help or stick around.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m040", title: "Put something in front of them\u2014an idea or a thing\u2014and leave room for a quick verdict.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m041", title: "Set up a small promise in front of them, then break it and see who reacts.", points: 3, difficulty: "hard", tags: ["irl"] },
  { id: "m042", title: "Create a reason they'd want to send you something after.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m043", title: "Speak just soft enough or in enough noise that listening requires a step closer.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m044", title: "Let something seem off\u2014tired, emotional\u2014and see who checks in.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m045", title: "Create a moment where a little reassurance would feel natural.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m046", title: "Set the mood for needing a laugh or a good joke.", points: 2, difficulty: "easy", tags: ["irl"] },
  { id: "m047", title: "Say something slightly unclear and see who asks you to say it again.", points: 1, difficulty: "easy", tags: ["irl"] },
  { id: "m048", title: "Let the gathering wind down and see who grabs the 'one last thing' moment.", points: 2, difficulty: "medium", tags: ["irl"] },
  { id: "m049", title: "Start a light 'confession' round and see who owns up to something small.", points: 3, difficulty: "hard", tags: ["irl"] },
  { id: "m050", title: "Be fully present and warm; leave any 'glad you're here' to them.", points: 4, difficulty: "legendary", tags: ["irl"] }
];
function hashStringToUint32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
__name(hashStringToUint32, "hashStringToUint32");
__name2(hashStringToUint32, "hashStringToUint32");
function mulberry32(seed) {
  return function() {
    let t = seed += 1831565813;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
__name(mulberry32, "mulberry32");
__name2(mulberry32, "mulberry32");
function shuffleWithSeed(array, rng) {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
__name(shuffleWithSeed, "shuffleWithSeed");
__name2(shuffleWithSeed, "shuffleWithSeed");
function computePlayerScore(assignedMissions, deckById) {
  let total = 0;
  for (const a of assignedMissions) {
    if (a.status !== "succeeded") continue;
    const mission = deckById.get(a.missionId);
    if (mission) total += mission.points;
  }
  return total;
}
__name(computePlayerScore, "computePlayerScore");
__name2(computePlayerScore, "computePlayerScore");
var ROOM_NAME_MIN = 3;
var ROOM_NAME_MAX = 18;
var ROOM_CODE_LEN = 4;
var ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function collapseWhitespace(s) {
  return s.replace(/\s+/g, " ").trim();
}
__name(collapseWhitespace, "collapseWhitespace");
__name2(collapseWhitespace, "collapseWhitespace");
function validateRoomName(name) {
  if (typeof name !== "string") {
    throw badRequest("Room name must be a string");
  }
  const sanitized = collapseWhitespace(name);
  if (sanitized.length < ROOM_NAME_MIN || sanitized.length > ROOM_NAME_MAX) {
    throw badRequest(
      `Room name must be ${ROOM_NAME_MIN}\u2013${ROOM_NAME_MAX} characters`
    );
  }
  return sanitized;
}
__name(validateRoomName, "validateRoomName");
__name2(validateRoomName, "validateRoomName");
function validateRoomCode(code) {
  if (typeof code !== "string") {
    throw badRequest("Room code must be a string");
  }
  const upper = code.trim().toUpperCase();
  if (upper.length < ROOM_CODE_LEN || upper.length > 5) {
    throw badRequest("Room code must be 4\u20135 characters");
  }
  for (const c of upper) {
    if (!ROOM_CODE_CHARS.includes(c)) {
      throw badRequest("Room code may only use letters and numbers (no I, O, 0, 1)");
    }
  }
  return upper;
}
__name(validateRoomCode, "validateRoomCode");
__name2(validateRoomCode, "validateRoomCode");
function generateRoomCode() {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LEN; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}
__name(generateRoomCode, "generateRoomCode");
__name2(generateRoomCode, "generateRoomCode");
var ROOM_PREFIX = "room:";
var DECK_BY_ID = new Map(MISSION_DECK.map((m) => [m.id, m]));
function roomKey(code) {
  return ROOM_PREFIX + code;
}
__name(roomKey, "roomKey");
__name2(roomKey, "roomKey");
async function getRoomFromKV(kv, code) {
  const raw = await kv.get(roomKey(code));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
__name(getRoomFromKV, "getRoomFromKV");
__name2(getRoomFromKV, "getRoomFromKV");
async function putRoomToKV(kv, room) {
  await kv.put(roomKey(room.code), JSON.stringify(room));
}
__name(putRoomToKV, "putRoomToKV");
__name2(putRoomToKV, "putRoomToKV");
function addEvent(room, type, by, meta) {
  room.events.push({
    at: Date.now(),
    type,
    by,
    meta
  });
  if (room.events.length > MAX_EVENTS) {
    room.events = room.events.slice(-MAX_EVENTS);
  }
}
__name(addEvent, "addEvent");
__name2(addEvent, "addEvent");
async function createRoomCode(kv, _name) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = generateRoomCode();
    const existing = await getRoomFromKV(kv, code);
    if (!existing) return code;
  }
  throw conflict("Could not generate unique room code; try again.");
}
__name(createRoomCode, "createRoomCode");
__name2(createRoomCode, "createRoomCode");
function pickCommonMission(code) {
  const seed = hashStringToUint32(code);
  const rng = mulberry32(seed);
  const i = Math.floor(rng() * MISSION_DECK.length);
  return MISSION_DECK[i].id;
}
__name(pickCommonMission, "pickCommonMission");
__name2(pickCommonMission, "pickCommonMission");
function buildAssignedMissions(code, commonMissionId, email) {
  const seedStr = `${code}:${commonMissionId}:${email}`;
  const seed = hashStringToUint32(seedStr);
  const rng = mulberry32(seed);
  const rest = MISSION_DECK.filter((m) => m.id !== commonMissionId);
  const shuffled = shuffleWithSeed(rest, rng);
  const personalIds = shuffled.slice(0, PERSONAL_MISSION_COUNT).map((m) => m.id);
  const common = { missionId: commonMissionId, status: "pending" };
  const personal = personalIds.map((id) => ({ missionId: id, status: "pending" }));
  return [common, ...personal];
}
__name(buildAssignedMissions, "buildAssignedMissions");
__name2(buildAssignedMissions, "buildAssignedMissions");
async function createRoom(kv, name, creatorEmail) {
  const code = await createRoomCode(kv, name);
  const commonMissionId = pickCommonMission(code);
  const now = Date.now();
  const displayName = displayNameFromEmail(creatorEmail);
  const assignedMissions = buildAssignedMissions(code, commonMissionId, creatorEmail);
  const room = {
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
        assignedMissions
      }
    },
    events: []
  };
  addEvent(room, "joined", creatorEmail);
  await putRoomToKV(kv, room);
  return { code, name };
}
__name(createRoom, "createRoom");
__name2(createRoom, "createRoom");
async function joinRoom(kv, code, email) {
  const room = await getRoomFromKV(kv, code);
  if (!room) throw notFound("Room not found");
  if (room.isClosed) throw conflict("Room is closed");
  if (room.players[email]) return;
  const displayName = displayNameFromEmail(email);
  const assignedMissions = buildAssignedMissions(room.code, room.commonMissionId, email);
  room.players[email] = {
    email,
    displayName,
    score: 0,
    joinedAt: Date.now(),
    assignedMissions
  };
  addEvent(room, "joined", email);
  await putRoomToKV(kv, room);
}
__name(joinRoom, "joinRoom");
__name2(joinRoom, "joinRoom");
async function leaveRoom(kv, code, email) {
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
__name(leaveRoom, "leaveRoom");
__name2(leaveRoom, "leaveRoom");
async function setMissionStatus(kv, code, email, missionId, status, targetEmail) {
  const room = await getRoomFromKV(kv, code);
  if (!room) throw notFound("Room not found");
  if (room.isClosed) throw conflict("Room is closed");
  const player = room.players[email];
  if (!player) throw forbidden("You are not in this room");
  const assignment = player.assignedMissions.find((a) => a.missionId === missionId);
  if (!assignment) throw forbidden("Mission not assigned to you");
  if (targetEmail !== void 0 && targetEmail !== "") {
    if (targetEmail === email) throw badRequest("Target cannot be yourself");
    if (!room.players[targetEmail]) throw badRequest("Target must be a player in this room");
  }
  assignment.status = status;
  assignment.completedAt = status !== "pending" ? Date.now() : void 0;
  assignment.targetEmail = status !== "pending" && targetEmail ? targetEmail : void 0;
  player.score = computePlayerScore(player.assignedMissions, DECK_BY_ID);
  const mission = DECK_BY_ID.get(missionId);
  const points = mission?.points ?? 0;
  const eventType = status === "succeeded" ? "mission_succeeded" : status === "failed" ? "mission_failed" : "mission_reset";
  const targetDisplayName = targetEmail && room.players[targetEmail] ? room.players[targetEmail].displayName : void 0;
  addEvent(room, eventType, email, {
    missionId,
    points,
    status,
    targetEmail: targetEmail || void 0,
    targetDisplayName
  });
  await putRoomToKV(kv, room);
}
__name(setMissionStatus, "setMissionStatus");
__name2(setMissionStatus, "setMissionStatus");
async function getMissionsData(kv, code, email) {
  const room = await getRoomFromKV(kv, code);
  if (!room) throw notFound("Room not found");
  const player = room.players[email];
  if (!player) throw forbidden("You are not in this room");
  const score = computePlayerScore(player.assignedMissions, DECK_BY_ID);
  const commonMission = DECK_BY_ID.get(room.commonMissionId);
  if (!commonMission) throw notFound("Common mission not found");
  const commonAssignment = player.assignedMissions.find((a) => a.missionId === room.commonMissionId);
  const personalAssignments = player.assignedMissions.filter((a) => a.missionId !== room.commonMissionId);
  const withTarget = /* @__PURE__ */ __name2((a, _mission) => {
    if (!a.targetEmail) return {};
    const target = room.players[a.targetEmail];
    return {
      targetEmail: a.targetEmail,
      targetDisplayName: target?.displayName
    };
  }, "withTarget");
  const personalMissions = personalAssignments.map((a) => {
    const mission = DECK_BY_ID.get(a.missionId);
    return mission ? {
      mission,
      status: a.status,
      completedAt: a.completedAt,
      ...withTarget(a, mission)
    } : null;
  }).filter((x) => x !== null);
  return {
    commonMission: {
      mission: commonMission,
      status: commonAssignment ? commonAssignment.status : "pending",
      completedAt: commonAssignment?.completedAt,
      ...commonAssignment ? withTarget(commonAssignment, commonMission) : {}
    },
    personalMissions,
    score
  };
}
__name(getMissionsData, "getMissionsData");
__name2(getMissionsData, "getMissionsData");
async function closeRoom(kv, code, email) {
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
__name(closeRoom, "closeRoom");
__name2(closeRoom, "closeRoom");
async function getRoomState(kv, code, email) {
  const room = await getRoomFromKV(kv, code);
  if (!room) throw notFound("Room not found");
  const players = Object.values(room.players).map((p) => ({
    ...p,
    score: computePlayerScore(p.assignedMissions, DECK_BY_ID)
  }));
  const ranking = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.joinedAt - b.joinedAt;
  }).map((p, i) => ({
    rank: i + 1,
    email: p.email,
    displayName: p.displayName,
    score: p.score
  }));
  const me = room.players[email] ?? null;
  const you = me ? {
    email: me.email,
    displayName: me.displayName,
    score: computePlayerScore(me.assignedMissions, DECK_BY_ID),
    isCreator: room.creatorEmail === email
  } : null;
  const missionEventTypes = ["mission_succeeded", "mission_failed", "mission_reset"];
  const sanitizedEvents = [...room.events].reverse().map((e) => {
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
      isClosed: room.isClosed
    },
    you: you ?? null,
    players: players.map((p) => ({ email: p.email, displayName: p.displayName, score: p.score })),
    ranking,
    events: sanitizedEvents
  };
}
__name(getRoomState, "getRoomState");
__name2(getRoomState, "getRoomState");
var VALID_STATUSES = ["pending", "succeeded", "failed"];
function validateMissionId(id) {
  if (typeof id !== "string" || !id.trim()) {
    throw badRequest("missionId must be a non-empty string");
  }
  return id.trim();
}
__name(validateMissionId, "validateMissionId");
__name2(validateMissionId, "validateMissionId");
function validateStatus(v) {
  if (typeof v !== "string" || !VALID_STATUSES.includes(v)) {
    throw badRequest("status must be one of: pending, succeeded, failed");
  }
  return v;
}
__name(validateStatus, "validateStatus");
__name2(validateStatus, "validateStatus");
function validateTargetEmail(v) {
  if (v === void 0 || v === null || v === "") return void 0;
  if (typeof v !== "string" || !v.trim()) return void 0;
  return v.trim();
}
__name(validateTargetEmail, "validateTargetEmail");
__name2(validateTargetEmail, "validateTargetEmail");
async function onRequestPost(context) {
  try {
    const email = getUserEmail(context.request);
    const body = await readJson(context.request);
    const code = validateRoomCode(body.code);
    const missionId = validateMissionId(body.missionId);
    const status = validateStatus(body.status);
    const targetEmail = validateTargetEmail(body.targetEmail);
    await setMissionStatus(context.env.ROOMS_KV, code, email, missionId, status, targetEmail);
    const data = await getMissionsData(context.env.ROOMS_KV, code, email);
    return jsonResponse({ ok: true, data });
  } catch (err) {
    return handleError(err);
  }
}
__name(onRequestPost, "onRequestPost");
__name2(onRequestPost, "onRequestPost");
async function onRequestPost2(context) {
  try {
    const email = getUserEmail(context.request);
    const body = await readJson(context.request);
    const code = validateRoomCode(body.code);
    await closeRoom(context.env.ROOMS_KV, code, email);
    const state = await getRoomState(context.env.ROOMS_KV, code, email);
    return jsonResponse({ ok: true, data: state });
  } catch (err) {
    return handleError(err);
  }
}
__name(onRequestPost2, "onRequestPost2");
__name2(onRequestPost2, "onRequestPost");
async function onRequestPost3(context) {
  try {
    const email = getUserEmail(context.request);
    const body = await readJson(context.request);
    const name = validateRoomName(body.name);
    const { code, name: roomName } = await createRoom(context.env.ROOMS_KV, name, email);
    return jsonResponse({ ok: true, data: { code, name: roomName } });
  } catch (err) {
    return handleError(err);
  }
}
__name(onRequestPost3, "onRequestPost3");
__name2(onRequestPost3, "onRequestPost");
async function onRequestPost4(context) {
  try {
    const email = getUserEmail(context.request);
    const body = await readJson(context.request);
    const code = validateRoomCode(body.code);
    await joinRoom(context.env.ROOMS_KV, code, email);
    const state = await getRoomState(context.env.ROOMS_KV, code, email);
    return jsonResponse({ ok: true, data: state });
  } catch (err) {
    return handleError(err);
  }
}
__name(onRequestPost4, "onRequestPost4");
__name2(onRequestPost4, "onRequestPost");
async function onRequestPost5(context) {
  try {
    const email = getUserEmail(context.request);
    const body = await readJson(context.request);
    const code = validateRoomCode(body.code);
    await leaveRoom(context.env.ROOMS_KV, code, email);
    const state = await getRoomState(context.env.ROOMS_KV, code, email);
    return jsonResponse({ ok: true, data: state });
  } catch (err) {
    return handleError(err);
  }
}
__name(onRequestPost5, "onRequestPost5");
__name2(onRequestPost5, "onRequestPost");
async function onRequestGet(context) {
  try {
    const email = getUserEmail(context.request);
    const url = new URL(context.request.url);
    const codeParam = url.searchParams.get("code");
    const code = validateRoomCode(codeParam ?? "");
    const data = await getMissionsData(context.env.ROOMS_KV, code, email);
    return jsonResponse({ ok: true, data });
  } catch (err) {
    return handleError(err);
  }
}
__name(onRequestGet, "onRequestGet");
__name2(onRequestGet, "onRequestGet");
async function onRequestGet2(context) {
  try {
    const email = getUserEmail(context.request);
    const url = new URL(context.request.url);
    const codeParam = url.searchParams.get("code");
    const code = validateRoomCode(codeParam ?? "");
    const state = await getRoomState(context.env.ROOMS_KV, code, email);
    return jsonResponse({ ok: true, data: state });
  } catch (err) {
    return handleError(err);
  }
}
__name(onRequestGet2, "onRequestGet2");
__name2(onRequestGet2, "onRequestGet");
async function onRequestGet3(context) {
  try {
    const email = getUserEmail(context.request);
    return jsonResponse({ ok: true, data: { email } });
  } catch (err) {
    return handleError(err);
  }
}
__name(onRequestGet3, "onRequestGet3");
__name2(onRequestGet3, "onRequestGet");
var routes = [
  {
    routePath: "/api/room/missions/complete",
    mountPath: "/api/room/missions",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/room/close",
    mountPath: "/api/room",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/room/create",
    mountPath: "/api/room",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/room/join",
    mountPath: "/api/room",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/room/leave",
    mountPath: "/api/room",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/room/missions",
    mountPath: "/api/room",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/room/state",
    mountPath: "/api/room",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/whoami",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-4CFZeM/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-4CFZeM/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.72312783353131.js.map
