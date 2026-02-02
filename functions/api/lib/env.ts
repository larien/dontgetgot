import type { KVStore } from "./store.ts";

/**
 * Bindings available to Pages Functions. ROOMS_KV is set in wrangler.toml.
 */
export interface Env {
  ROOMS_KV: KVStore;
}
