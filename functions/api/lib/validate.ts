import { badRequest } from "./errors.ts";

const ROOM_NAME_MIN = 3;
const ROOM_NAME_MAX = 18;
const ROOM_CODE_LEN = 4;
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I,O,0,1
const POINTS_MIN = 1;
const POINTS_MAX = 5;
const NOTE_MAX = 80;

function collapseWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Validates and sanitizes room name: 3–18 chars, trim, collapse whitespace.
 */
export function validateRoomName(name: unknown): string {
  if (typeof name !== "string") {
    throw badRequest("Room name must be a string");
  }
  const sanitized = collapseWhitespace(name);
  if (sanitized.length < ROOM_NAME_MIN || sanitized.length > ROOM_NAME_MAX) {
    throw badRequest(
      `Room name must be ${ROOM_NAME_MIN}–${ROOM_NAME_MAX} characters`
    );
  }
  return sanitized;
}

/**
 * Validates room code: 4–5 chars, uppercase, only allowed charset (no I,O,0,1).
 */
export function validateRoomCode(code: unknown): string {
  if (typeof code !== "string") {
    throw badRequest("Room code must be a string");
  }
  const upper = code.trim().toUpperCase();
  if (upper.length < ROOM_CODE_LEN || upper.length > 5) {
    throw badRequest("Room code must be 4–5 characters");
  }
  for (const c of upper) {
    if (!ROOM_CODE_CHARS.includes(c)) {
      throw badRequest("Room code may only use letters and numbers (no I, O, 0, 1)");
    }
  }
  return upper;
}

/**
 * Validates points: 1–5.
 */
export function validatePoints(points: unknown): number {
  const n = Number(points);
  if (!Number.isInteger(n) || n < POINTS_MIN || n > POINTS_MAX) {
    throw badRequest(`Points must be between ${POINTS_MIN} and ${POINTS_MAX}`);
  }
  return n;
}

/**
 * Validates optional note: max 80 chars.
 */
export function validateNote(note: unknown): string | undefined {
  if (note === undefined || note === null) {
    return undefined;
  }
  if (typeof note !== "string") {
    throw badRequest("Note must be a string");
  }
  const s = note.trim();
  if (s.length > NOTE_MAX) {
    throw badRequest(`Note must be at most ${NOTE_MAX} characters`);
  }
  return s || undefined;
}

/** Generate a random room code (4 chars from allowed set). */
export function generateRoomCode(): string {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LEN; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}
