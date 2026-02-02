import type { AppError } from "./errors.ts";
import { errorResponse } from "./json.ts";

export function isAppError(err: unknown): err is AppError {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "code" in err &&
    "message" in err
  );
}

export function handleError(err: unknown): Response {
  if (isAppError(err)) return errorResponse(err);
  throw err;
}
