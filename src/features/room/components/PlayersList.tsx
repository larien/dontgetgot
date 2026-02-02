import type { PlayerRow } from "@/app/api/types";
import type { YouInfo } from "@/app/api/types";

interface PlayersListProps {
  players: PlayerRow[];
  you: YouInfo | null;
}

export function PlayersList({ players, you }: PlayersListProps) {
  if (players.length === 0) {
    return <p className="text-sm text-dgg-muted">No players in room.</p>;
  }

  return (
    <ul className="space-y-1.5" aria-label="Players in room">
      {players.map((p) => {
        const isYou = you?.email === p.email;
        return (
          <li
            key={p.email}
            className={`flex items-center justify-between rounded-lg border-2 px-3 py-2 text-sm ${
              isYou
                ? "border-dgg-lime/50 bg-dgg-lime/10 text-dgg-lime-bright"
                : "border-dgg-border/50 bg-dgg-surface/50 text-zinc-200"
            }`}
          >
            <span>
              {p.displayName}
              {isYou && <span className="ml-2 text-dgg-muted">(you)</span>}
            </span>
            <span className="font-bold text-dgg-lime">{p.score}</span>
          </li>
        );
      })}
    </ul>
  );
}
