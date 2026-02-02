import type { ApiError, ApiResponse } from "./types";

/** Thrown when the API returns ok: false. */
export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

function emptyResponseHint(status: number): string {
  if (status === 0) {
    return " (API unreachable — for local dev, run `npm run dev:api` in another terminal after `npm run build`.)";
  }
  if (status === 401) {
    return " (Enter your name, nickname, or email on the login page.)";
  }
  return "";
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trim()) {
    const hint = emptyResponseHint(res.status);
    throw new ApiClientError(
      res.status,
      "EMPTY",
      `Empty response from server${hint}`
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiClientError(res.status, "INVALID_JSON", "Invalid JSON response");
  }
}

/** Header sent with user identity (name, nickname, or email) from the login page. */
const USER_IDENTITY_HEADER = "X-User-Identity";

/** Fetch wrapper: parses JSON and maps error envelope to ApiClientError. */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  const { getAuthIdentity } = await import("@/app/auth");
  const identity = getAuthIdentity();
  if (identity) {
    headers[USER_IDENTITY_HEADER] = identity;
  }
  const res = await fetch(url, {
    ...init,
    headers,
  });
  const body = await parseJson<ApiResponse<T>>(res);
  if (!res.ok) {
    const err = body as ApiError;
    throw new ApiClientError(
      res.status,
      err.error?.code ?? "UNKNOWN",
      err.error?.message ?? res.statusText
    );
  }
  if ("ok" in body && body.ok === false) {
    const err = body as ApiError;
    throw new ApiClientError(res.status, err.error.code, err.error.message);
  }
  return (body as { ok: true; data: T }).data;
}
