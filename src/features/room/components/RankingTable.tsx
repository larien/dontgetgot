import type { RankingRow } from "@/app/api/types";
import type { YouInfo } from "@/app/api/types";

interface RankingTableProps {
  ranking: RankingRow[];
  you: YouInfo | null;
}

export function RankingTable({ ranking, you }: RankingTableProps) {
  if (ranking.length === 0) {
    return (
      <p className="text-sm text-dgg-muted">No players yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm" aria-label="Ranking">
        <thead>
          <tr className="border-b-2 border-dgg-border text-dgg-muted">
            <th className="pb-2 pr-4 font-bold uppercase tracking-wide">#</th>
            <th className="pb-2 pr-4 font-bold uppercase tracking-wide">Player</th>
            <th className="pb-2 font-bold uppercase tracking-wide">Score</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((row) => {
            const isYou = you?.email === row.email;
            return (
              <tr
                key={row.email}
                className={`border-b border-dgg-border/50 ${
                  isYou ? "bg-dgg-lime/15 text-dgg-lime-bright font-medium" : "text-zinc-200"
                }`}
              >
                <td className="py-2 pr-4 font-mono">{row.rank}</td>
                <td className="py-2 pr-4">
                  {row.displayName}
                  {isYou && (
                    <span className="ml-2 text-xs text-dgg-muted">(you)</span>
                  )}
                </td>
                <td className="py-2 font-bold">{row.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
