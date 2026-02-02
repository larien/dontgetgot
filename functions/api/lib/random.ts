/**
 * FNV-1a 32-bit hash. Stable: same string → same uint32.
 */
export function hashStringToUint32(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Mulberry32 seeded PRNG. Returns a function that yields floats [0, 1).
 */
export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a new array shuffled using the given RNG (deterministic for same rng state).
 */
export function shuffleWithSeed<T>(array: T[], rng: () => number): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Pick one element from array using seeded RNG.
 */
export function randomPick<T>(array: T[], seed: number): T {
  if (array.length === 0) throw new Error("randomPick: empty array");
  const rng = mulberry32(seed);
  const i = Math.floor(rng() * array.length);
  return array[i];
}
