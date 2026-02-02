/** Typed app error for consistent API responses. */
export interface AppError {
  status: number;
  code: string;
  message: string;
}

export function badRequest(message: string): AppError {
  return { status: 400, code: "BAD_REQUEST", message };
}

export function unauthorized(message: string): AppError {
  return { status: 401, code: "UNAUTHORIZED", message };
}

export function forbidden(message: string): AppError {
  return { status: 403, code: "FORBIDDEN", message };
}

export function notFound(message: string): AppError {
  return { status: 404, code: "NOT_FOUND", message };
}

export function conflict(message: string): AppError {
  return { status: 409, code: "CONFLICT", message };
}
