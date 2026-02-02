export const API = {
  whoami: "/api/whoami",
  room: {
    create: "/api/room/create",
    join: "/api/room/join",
    state: (code: string) => `/api/room/state?code=${encodeURIComponent(code)}`,
    missions: (code: string) => `/api/room/missions?code=${encodeURIComponent(code)}`,
    missionsComplete: "/api/room/missions/complete",
    leave: "/api/room/leave",
    close: "/api/room/close",
  },
} as const;
