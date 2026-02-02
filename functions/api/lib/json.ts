import type { AppError } from "./errors.ts";

export async function readJson<T>(request: Request): Promise<T> {
  const text = await request.text();
  if (!text.trim()) {
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw { status: 400, code: "INVALID_JSON", message: "Invalid JSON body" } as AppError;
  }
}

const JSON_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
};

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });
}

export function errorResponse(err: AppError): Response {
  return jsonResponse(
    { ok: false, error: { code: err.code, message: err.message } },
    err.status
  );
}
