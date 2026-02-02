import { getUserEmail } from "./lib/headers.ts";
import { handleError } from "./lib/handler.ts";
import { jsonResponse } from "./lib/json.ts";

export async function onRequestGet(context: { request: Request }): Promise<Response> {
  try {
    const email = getUserEmail(context.request);
    return jsonResponse({ ok: true, data: { email } });
  } catch (err) {
    return handleError(err);
  }
}
