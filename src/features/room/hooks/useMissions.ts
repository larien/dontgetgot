import { useQuery } from "@tanstack/react-query";
import { API } from "@/app/api/endpoints";
import { apiFetch } from "@/app/api/client";
import type { MissionsData } from "@/app/api/types";

export const MISSIONS_QUERY_KEY = "roomMissions";
const POLL_INTERVAL_MS = 2000;

export function useMissions(code: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: [MISSIONS_QUERY_KEY, code],
    queryFn: () => apiFetch<MissionsData>(API.room.missions(code!)),
    enabled: Boolean(code && enabled),
    refetchInterval: POLL_INTERVAL_MS,
  });
}
