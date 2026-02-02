import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Flame } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import { API } from "@/app/api/endpoints";
import { apiFetch } from "@/app/api/client";
import type { RoomStateData, MissionsData, MissionStatusView } from "@/app/api/types";
import { useRoomPoll } from "../hooks/useRoomPoll";
import { useMissions, MISSIONS_QUERY_KEY } from "../hooks/useMissions";
import { useToast } from "@/ui/Toast";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Spinner } from "@/ui/Spinner";
import { RoomHeader } from "../components/RoomHeader";
import { RankingTable } from "../components/RankingTable";
import { PlayersList } from "../components/PlayersList";
import { EventFeed } from "../components/EventFeed";
import { MissionsCard } from "../components/MissionsCard";

const ROOM_STATE_QUERY_KEY = "roomState";

export function RoomPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useRoomPoll(code, true);
  const { data: missionsData, isLoading: missionsLoading } = useMissions(code, !!data?.you);

  const leaveMutation = useMutation({
    mutationFn: async () => {
      if (!code) throw new Error("No room code");
      return apiFetch<RoomStateData>(API.room.leave, {
        method: "POST",
        body: JSON.stringify({ code }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_STATE_QUERY_KEY, code] });
      addToast("success", "Left room");
      navigate("/");
    },
    onError: (err: unknown) => {
      addToast("error", err instanceof Error ? err.message : "Failed to leave");
    },
  });

  const closeMutation = useMutation({
    mutationFn: async () => {
      if (!code) throw new Error("No room code");
      return apiFetch<RoomStateData>(API.room.close, {
        method: "POST",
        body: JSON.stringify({ code }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_STATE_QUERY_KEY, code] });
      addToast("success", "Room closed");
      refetch();
    },
    onError: (err: unknown) => {
      addToast("error", err instanceof Error ? err.message : "Failed to close room");
    },
  });

  const setMissionStatusMutation = useMutation({
    mutationFn: async ({
      missionId,
      status,
      targetEmail,
    }: {
      missionId: string;
      status: MissionStatusView;
      targetEmail?: string;
    }) => {
      if (!code) throw new Error("No room code");
      return apiFetch<MissionsData>(API.room.missionsComplete, {
        method: "POST",
        body: JSON.stringify({ code, missionId, status, targetEmail }),
      });
    },
    onMutate: async ({ missionId, status, targetEmail }) => {
      await queryClient.cancelQueries({ queryKey: [MISSIONS_QUERY_KEY, code] });
      const prev = queryClient.getQueryData<MissionsData>([MISSIONS_QUERY_KEY, code]);
      const roomData = queryClient.getQueryData<RoomStateData>([ROOM_STATE_QUERY_KEY, code]);
      const targetDisplayName =
        targetEmail && roomData?.players
          ? roomData.players.find((p) => p.email === targetEmail)?.displayName
          : undefined;
      if (!prev) return { prev: undefined };
      const update = (
        assigned: {
          mission: { id: string };
          status: MissionStatusView;
          completedAt?: number;
          targetEmail?: string;
          targetDisplayName?: string;
        }
      ) =>
        assigned.mission.id === missionId
          ? {
              ...assigned,
              status,
              completedAt: status !== "pending" ? Date.now() : undefined,
              targetEmail: status !== "pending" ? targetEmail : undefined,
              targetDisplayName: status !== "pending" ? targetDisplayName : undefined,
            }
          : assigned;
      const mission =
        prev.commonMission.mission.id === missionId
          ? prev.commonMission.mission
          : prev.personalMissions.find((a) => a.mission.id === missionId)?.mission;
      const points = mission?.points ?? 0;
      const wasSucceeded =
        prev.commonMission.mission.id === missionId
          ? prev.commonMission.status === "succeeded"
          : prev.personalMissions.find((a) => a.mission.id === missionId)?.status === "succeeded";
      const nowSucceeded = status === "succeeded";
      const delta = (nowSucceeded ? points : 0) - (wasSucceeded ? points : 0);
      queryClient.setQueryData<MissionsData>([MISSIONS_QUERY_KEY, code], {
        ...prev,
        commonMission: update(prev.commonMission) as typeof prev.commonMission,
        personalMissions: prev.personalMissions.map((a) => update(a) as typeof a),
        score: prev.score + delta,
      });
      return { prev };
    },
    onError: (err, _variables, context) => {
      if (context?.prev != null) {
        queryClient.setQueryData([MISSIONS_QUERY_KEY, code], context.prev);
      }
      queryClient.invalidateQueries({ queryKey: [MISSIONS_QUERY_KEY, code] });
      queryClient.invalidateQueries({ queryKey: [ROOM_STATE_QUERY_KEY, code] });
      addToast("error", err instanceof Error ? err.message : "Failed to update mission");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOM_STATE_QUERY_KEY, code] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [MISSIONS_QUERY_KEY, code] });
    },
  });

  if (!code) {
    return (
      <div className="flex min-h-screen items-center justify-center text-dgg-muted">
        <p>Missing room code.</p>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-zinc-100">
        <p className="text-dgg-muted">
          {error instanceof Error ? error.message : "Failed to load room"}
        </p>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back to home
        </Button>
      </div>
    );
  }

  const { room, you, players, ranking, events } = data;

  if (!you) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-zinc-100">
        <p className="text-dgg-muted">You are not in this room.</p>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back to home
        </Button>
      </div>
    );
  }

  const otherPlayers = players.filter((p) => p.email !== you.email);
  const handleSetMissionStatus = (missionId: string, status: MissionStatusView, targetEmail?: string) => {
    setMissionStatusMutation.mutate({ missionId, status, targetEmail });
  };

  return (
    <div className="min-h-screen p-6 text-zinc-100">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <RoomHeader room={room} />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => leaveMutation.mutate()}
              disabled={leaveMutation.isPending}
              aria-label="Leave room"
            >
              <LogOut className="h-4 w-4" />
              Leave
            </Button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-xs text-zinc-300 underline hover:text-zinc-100"
              aria-label="Log out (switch user)"
            >
              Not you?
            </button>
            {you.isCreator && !room.isClosed && (
              <Button
                variant="danger"
                onClick={() => closeMutation.mutate()}
                disabled={closeMutation.isPending}
                aria-label="Close room (creator only)"
              >
                <Flame className="h-4 w-4" />
                Burn the File
              </Button>
            )}
          </div>
        </div>

        {room.isClosed && (
          <Card className="border-dgg-failed/50 bg-dgg-failed/10">
            <p className="text-sm font-bold uppercase tracking-wide text-dgg-failed-bright">
              Room closed by creator
            </p>
            <p className="mt-1 text-xs text-dgg-muted">
              No new joins or claims. You can still view the final ranking.
            </p>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {!room.isClosed &&
              (missionsLoading && !missionsData ? (
                <Card>
                  <p className="text-sm text-dgg-muted">Loading missions…</p>
                </Card>
              ) : missionsData ? (
                <MissionsCard
                  commonMission={missionsData.commonMission}
                  personalMissions={missionsData.personalMissions}
                  score={missionsData.score}
                  otherPlayers={otherPlayers}
                  onSetStatus={handleSetMissionStatus}
                  disabled={setMissionStatusMutation.isPending}
                />
              ) : null)}
            <Card className="border-dgg-border/50 bg-dgg-surface/95">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-zinc-200">
                How it works
              </h2>
              <ul className="space-y-1.5 text-sm text-zinc-200">
                <li>• You have <strong>1 common mission</strong> (same for everyone) and <strong>5 personal missions</strong>.</li>
                <li>• Try to apply each mission to someone. If you achieve it, click <strong>Got</strong> (green); if you fail, click <strong>Failed</strong> (red).</li>
                <li>• In both cases assign <strong>who got got</strong>. Only Got scores points.</li>
                <li>• Highest score wins. The creator can close the room when you&apos;re done.</li>
              </ul>
            </Card>
            <Card>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-200">
                Players
              </h2>
              <PlayersList players={players} you={you} />
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-200">
                Ranking
              </h2>
              <RankingTable ranking={ranking} you={you} />
            </Card>
            <Card>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-200">
                Recent events
              </h2>
              <EventFeed events={events} limit={10} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
