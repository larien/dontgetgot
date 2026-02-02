/** Format timestamp for display (relative or short time). */
export function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/** Format event type for display. */
export function formatEventType(type: string): string {
  switch (type) {
    case "joined":
      return "joined";
    case "left":
      return "left";
    case "claimed":
      return "claimed points";
    case "closed":
      return "closed the room";
    case "mission_succeeded":
      return "succeeded at a mission";
    case "mission_failed":
      return "failed a mission";
    case "mission_reset":
      return "reset a mission";
    default:
      return type;
  }
}
