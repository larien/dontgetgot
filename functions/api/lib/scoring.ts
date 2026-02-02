import type { AssignedMission, Mission } from "./types.ts";

/**
 * Single authoritative score computation from assigned missions and deck.
 * Only "succeeded" missions count. Never duplicate this logic elsewhere.
 */
export function computePlayerScore(
  assignedMissions: AssignedMission[],
  deckById: Map<string, Mission>
): number {
  let total = 0;
  for (const a of assignedMissions) {
    if (a.status !== "succeeded") continue;
    const mission = deckById.get(a.missionId);
    if (mission) total += mission.points;
  }
  return total;
}
