import type { Env } from "../lib/env.ts";
import { getUserEmail } from "../lib/headers.ts";
import { handleError } from "../lib/handler.ts";
import { jsonResponse, readJson } from "../lib/json.ts";
import { createRoom as createRoomInStore } from "../lib/store.ts";
import { validateRoomName } from "../lib/validate.ts";

interface CreateBody {
  name?: unknown;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const email = getUserEmail(context.request);
    const body = await readJson<CreateBody>(context.request);
    const name = validateRoomName(body.name);
    const { code, name: roomName } = await createRoomInStore(context.env.ROOMS_KV, name, email);
    return jsonResponse({ ok: true, data: { code, name: roomName } });
  } catch (err) {
    return handleError(err);
  }
}
