/**
 * Current user identity (name, nickname, or email) for API requests. Set by login; read by API client.
 * Persisted in localStorage key below. No Cloudflare Access; the page is public.
 */
const STORAGE_KEY = "dgg-user-identity";
const LEGACY_KEY = "dgg-user-email";

let currentIdentity: string | null = null;

function loadFromStorage(): string | null {
  try {
    let s = localStorage.getItem(STORAGE_KEY)?.trim() || null;
    if (!s) {
      const legacy = localStorage.getItem(LEGACY_KEY)?.trim();
      if (legacy) {
        localStorage.setItem(STORAGE_KEY, legacy);
        localStorage.removeItem(LEGACY_KEY);
        s = legacy;
      }
    }
    return s || null;
  } catch {
    return null;
  }
}

export function getAuthIdentity(): string | null {
  if (currentIdentity !== null) return currentIdentity;
  currentIdentity = loadFromStorage();
  return currentIdentity;
}

export function setAuthIdentity(identity: string | null): void {
  currentIdentity = identity ?? null;
  try {
    if (identity?.trim()) {
      localStorage.setItem(STORAGE_KEY, identity.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
}

/** @deprecated Use getAuthIdentity. Kept for compatibility. */
export const getAuthEmail = getAuthIdentity;

/** @deprecated Use setAuthIdentity. Kept for compatibility. */
export const setAuthEmail = setAuthIdentity;
