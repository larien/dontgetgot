import { useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { Badge } from "@/ui/Badge";
import { Card, CardTitle } from "@/ui/Card";
import type { AssignedMissionView } from "@/app/api/types";
import type { MissionStatusView } from "@/app/api/types";

export interface OtherPlayer {
  email: string;
  displayName: string;
}

interface MissionsCardProps {
  commonMission: AssignedMissionView;
  personalMissions: AssignedMissionView[];
  score: number;
  otherPlayers: OtherPlayer[];
  onSetStatus: (missionId: string, status: MissionStatusView, targetEmail?: string) => void;
  disabled?: boolean;
}

export function MissionsCard({
  commonMission,
  personalMissions,
  score,
  otherPlayers,
  onSetStatus,
  disabled,
}: MissionsCardProps) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <CardTitle>Missions</CardTitle>
        <Badge variant="default">Score: {score}</Badge>
      </div>

      <div className="space-y-4">
        <section aria-label="Common mission">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-dgg-muted">
            Common mission — same for everyone
          </p>
          <MissionRow
            variant="common"
            assigned={commonMission}
            otherPlayers={otherPlayers}
            onSetStatus={onSetStatus}
            disabled={disabled}
          />
        </section>

        <section aria-label="Your missions">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-dgg-muted">
            Your missions
          </p>
          <ul className="space-y-2">
            {personalMissions.map((assigned) => (
              <li key={assigned.mission.id}>
                <MissionRow
                  variant="personal"
                  assigned={assigned}
                  otherPlayers={otherPlayers}
                  onSetStatus={onSetStatus}
                  disabled={disabled}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}

type SelectingTarget = { missionId: string; status: "succeeded" | "failed" };

function MissionRow({
  variant,
  assigned,
  otherPlayers,
  onSetStatus,
  disabled,
}: {
  variant: "common" | "personal";
  assigned: AssignedMissionView;
  otherPlayers: OtherPlayer[];
  onSetStatus: (missionId: string, status: MissionStatusView, targetEmail?: string) => void;
  disabled?: boolean;
}) {
  const { mission, status, targetDisplayName } = assigned;
  const id = mission.id;
  const [selectingTarget, setSelectingTarget] = useState<SelectingTarget | null>(null);
  const isSelecting = selectingTarget?.missionId === id;

  const isDark = variant === "common";

  const statusStylesCommon = {
    pending: "border-dgg-border bg-dgg-surface text-zinc-200",
    succeeded: "border-dgg-nailed/60 bg-dgg-nailed/20 text-zinc-100",
    failed: "border-dgg-failed/60 bg-dgg-failed/20 text-zinc-100",
  };

  const statusStylesPersonal = {
    pending: "border-zinc-200 bg-white text-zinc-800",
    succeeded: "border-dgg-nailed/50 bg-dgg-nailed/15 text-zinc-800",
    failed: "border-dgg-failed/50 bg-dgg-failed/15 text-zinc-800",
  };

  const statusStyles = isDark ? statusStylesCommon : statusStylesPersonal;

  const handleStatusClick = (newStatus: "succeeded" | "failed") => {
    if (otherPlayers.length === 0) {
      onSetStatus(id, newStatus);
      return;
    }
    setSelectingTarget({ missionId: id, status: newStatus });
  };

  const handleTargetPick = (targetEmail: string | undefined) => {
    if (selectingTarget) {
      onSetStatus(id, selectingTarget.status, targetEmail);
      setSelectingTarget(null);
    }
  };

  return (
    <div className={`flex flex-wrap items-start gap-2 rounded-lg border-2 px-3 py-2 ${statusStyles[status]}`}>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => handleStatusClick("succeeded")}
          disabled={disabled}
          aria-label="Mark as succeeded"
          title="Succeeded"
          className={`flex h-7 min-w-[2rem] items-center justify-center gap-1 rounded border-2 px-2 text-xs font-medium transition-colors ${
            status === "succeeded"
              ? "border-dgg-nailed bg-dgg-nailed text-black"
              : "border-dgg-border bg-transparent text-zinc-400 hover:border-dgg-nailed hover:text-dgg-nailed"
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          Got
        </button>
        <button
          type="button"
          onClick={() => handleStatusClick("failed")}
          disabled={disabled}
          aria-label="Mark as failed"
          title="Failed"
          className={`flex h-7 min-w-[2rem] items-center justify-center gap-1 rounded border-2 px-2 text-xs font-medium transition-colors ${
            status === "failed"
              ? "border-dgg-failed bg-dgg-failed text-black"
              : "border-dgg-border bg-transparent text-zinc-400 hover:border-dgg-failed hover:text-dgg-failed"
          }`}
        >
          <X className="h-3.5 w-3.5" />
          Failed
        </button>
        {status !== "pending" && (
          <button
            type="button"
            onClick={() => onSetStatus(id, "pending")}
            disabled={disabled}
            aria-label="Reset to pending"
            title="Reset"
            className="flex h-7 w-7 items-center justify-center rounded border-2 border-dgg-border bg-transparent text-zinc-400 hover:border-dgg-muted hover:text-dgg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
          {mission.title}
        </p>
        {mission.description && (
          <p className={`mt-0.5 text-xs ${isDark ? "text-dgg-muted" : "text-zinc-600"}`}>
            {mission.description}
          </p>
        )}
        {targetDisplayName && status !== "pending" && (
          <p className={`mt-1 text-xs ${isDark ? "text-dgg-muted" : "text-zinc-600"}`}>
            Who got got: <span className={isDark ? "font-medium text-zinc-300" : "font-medium text-zinc-700"}>{targetDisplayName}</span>
          </p>
        )}
        {isSelecting && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`text-xs ${isDark ? "text-dgg-muted" : "text-zinc-600"}`}>Who got got?</span>
            {otherPlayers.map((p) => (
              <button
                key={p.email}
                type="button"
                onClick={() => handleTargetPick(p.email)}
                disabled={disabled}
                className={isDark
                  ? "rounded border border-dgg-border bg-dgg-bg/80 px-2 py-1 text-xs text-zinc-300 hover:bg-dgg-border/30"
                  : "rounded border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200"}
              >
                {p.displayName}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleTargetPick(undefined)}
              disabled={disabled}
              className={isDark
                ? "rounded border border-dgg-border bg-dgg-bg/80 px-2 py-1 text-xs text-dgg-muted hover:bg-dgg-border/30"
                : "rounded border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-200"}
            >
              Skip
            </button>
          </div>
        )}
      </div>
      <Badge variant="default" className={`shrink-0 ${isDark ? "" : "!bg-zinc-200 !border-zinc-300 !text-zinc-800"}`}>
        {mission.points} pt{mission.points !== 1 ? "s" : ""}
      </Badge>
    </div>
  );
}
