import { formatTime, formatEventType } from "@/app/utils/format";
import type { RoomEventView } from "@/app/api/types";

interface EventFeedProps {
  events: RoomEventView[];
  /** Show at most this many (e.g. 10). */
  limit?: number;
}

export function EventFeed({ events, limit = 10 }: EventFeedProps) {
  const shown = events.slice(0, limit);
  if (shown.length === 0) {
    return <p className="text-sm text-dgg-muted">No events yet.</p>;
  }

  return (
    <ul className="space-y-1.5 text-sm" aria-label="Recent events">
      {shown.map((e, i) => (
        <li
          key={`${e.at}-${e.by}-${i}`}
          className="flex flex-wrap items-baseline gap-2 text-dgg-muted"
        >
          <span className="text-xs tabular-nums">{formatTime(e.at)}</span>
          <span className="text-zinc-300">
            <strong className="font-medium text-zinc-200">{e.by.split("@")[0]}</strong>{" "}
            {formatEventType(e.type)}
            {e.meta?.points != null && (
              <span className="font-medium text-dgg-nailed-bright"> +{e.meta.points}</span>
            )}
            {e.meta?.targetDisplayName && (
              <span className="text-dgg-muted"> (who got got: {e.meta.targetDisplayName})</span>
            )}
            {e.meta?.note && (
              <span className="italic"> — {e.meta.note}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
