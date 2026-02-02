import type { Env } from "../lib/env.ts";
import { getUserEmail } from "../lib/headers.ts";
import { handleError } from "../lib/handler.ts";
import { jsonResponse, readJson } from "../lib/json.ts";
import { getRoomState, leaveRoom } from "../lib/store.ts";
import { validateRoomCode } from "../lib/validate.ts";

interface LeaveBody {
  code?: unknown;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const email = getUserEmail(context.request);
    const body = await readJson<LeaveBody>(context.request);
    const code = validateRoomCode(body.code);
    await leaveRoom(context.env.ROOMS_KV, code, email);
    const state = await getRoomState(context.env.ROOMS_KV, code, email);
    return jsonResponse({ ok: true, data: state });
  } catch (err) {
    return handleError(err);
  }
}
