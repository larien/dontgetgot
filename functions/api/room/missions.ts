import type { Env } from "../lib/env.ts";
import { getUserEmail } from "../lib/headers.ts";
import { handleError } from "../lib/handler.ts";
import { jsonResponse } from "../lib/json.ts";
import { getMissionsData } from "../lib/store.ts";
import { validateRoomCode } from "../lib/validate.ts";

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
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
