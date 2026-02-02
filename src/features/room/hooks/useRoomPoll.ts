import { useQuery } from "@tanstack/react-query";
import { API } from "@/app/api/endpoints";
import { apiFetch } from "@/app/api/client";
import type { RoomStateData } from "@/app/api/types";

const ROOM_STATE_QUERY_KEY = "roomState";
const POLL_INTERVAL_MS = 2000;

export function useRoomPoll(code: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: [ROOM_STATE_QUERY_KEY, code],
    queryFn: () => apiFetch<RoomStateData>(API.room.state(code!)),
    enabled: Boolean(code && enabled),
    refetchInterval: (query) => {
      const data = query.state.data as RoomStateData | undefined;
      if (data?.room.isClosed) return false;
      return POLL_INTERVAL_MS;
    },
  });
}
