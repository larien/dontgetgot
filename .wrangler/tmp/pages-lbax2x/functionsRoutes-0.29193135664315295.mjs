import { onRequestPost as __api_room_missions_complete_ts_onRequestPost } from "/Users/larien/go/src/github.com/larien/dontgetgot/functions/api/room/missions/complete.ts"
import { onRequestPost as __api_room_close_ts_onRequestPost } from "/Users/larien/go/src/github.com/larien/dontgetgot/functions/api/room/close.ts"
import { onRequestPost as __api_room_create_ts_onRequestPost } from "/Users/larien/go/src/github.com/larien/dontgetgot/functions/api/room/create.ts"
import { onRequestPost as __api_room_join_ts_onRequestPost } from "/Users/larien/go/src/github.com/larien/dontgetgot/functions/api/room/join.ts"
import { onRequestPost as __api_room_leave_ts_onRequestPost } from "/Users/larien/go/src/github.com/larien/dontgetgot/functions/api/room/leave.ts"
import { onRequestGet as __api_room_missions_ts_onRequestGet } from "/Users/larien/go/src/github.com/larien/dontgetgot/functions/api/room/missions.ts"
import { onRequestGet as __api_room_state_ts_onRequestGet } from "/Users/larien/go/src/github.com/larien/dontgetgot/functions/api/room/state.ts"
import { onRequestGet as __api_whoami_ts_onRequestGet } from "/Users/larien/go/src/github.com/larien/dontgetgot/functions/api/whoami.ts"

export const routes = [
    {
      routePath: "/api/room/missions/complete",
      mountPath: "/api/room/missions",
      method: "POST",
      middlewares: [],
      modules: [__api_room_missions_complete_ts_onRequestPost],
    },
  {
      routePath: "/api/room/close",
      mountPath: "/api/room",
      method: "POST",
      middlewares: [],
      modules: [__api_room_close_ts_onRequestPost],
    },
  {
      routePath: "/api/room/create",
      mountPath: "/api/room",
      method: "POST",
      middlewares: [],
      modules: [__api_room_create_ts_onRequestPost],
    },
  {
      routePath: "/api/room/join",
      mountPath: "/api/room",
      method: "POST",
      middlewares: [],
      modules: [__api_room_join_ts_onRequestPost],
    },
  {
      routePath: "/api/room/leave",
      mountPath: "/api/room",
      method: "POST",
      middlewares: [],
      modules: [__api_room_leave_ts_onRequestPost],
    },
  {
      routePath: "/api/room/missions",
      mountPath: "/api/room",
      method: "GET",
      middlewares: [],
      modules: [__api_room_missions_ts_onRequestGet],
    },
  {
      routePath: "/api/room/state",
      mountPath: "/api/room",
      method: "GET",
      middlewares: [],
      modules: [__api_room_state_ts_onRequestGet],
    },
  {
      routePath: "/api/whoami",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_whoami_ts_onRequestGet],
    },
  ]