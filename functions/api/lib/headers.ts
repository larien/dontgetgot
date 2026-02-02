import { unauthorized } from "./errors.ts";

/** Header sent by the frontend with the user's identity (name, nickname, or email). No Cloudflare Access. */
const USER_IDENTITY_HEADER = "X-User-Identity";

/**
 * Reads the user identity from the request. Throws if header is missing or empty.
 * The app is public; identity is whatever the user entered on the login page (name, nickname, or email).
 */
export function getUserEmail(request: Request): string {
  const identity = request.headers.get(USER_IDENTITY_HEADER)?.trim();
  if (!identity) {
    throw unauthorized(
      "Identity required. Enter your name, nickname, or email on the login page."
    );
  }
  return identity;
}

/**
 * Derives a display name from identity. If it looks like an email (contains @), use the local part
 * and format it; otherwise use the string as-is (trimmed, single-line).
 */
export function displayNameFromEmail(identity: string): string {
  const trimmed = identity.trim();
  if (!trimmed.includes("@")) return trimmed.slice(0, 64) || "Player";
  const local = trimmed.split("@")[0] ?? trimmed;
  const words = local.replace(/[._]/g, " ").split(/\s+/).filter(Boolean);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
    .trim()
    .slice(0, 64) || local.slice(0, 64) || "Player";
}
