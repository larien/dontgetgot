/** API response envelope: success. */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

/** API response envelope: error. */
export interface ApiError {
  ok: false;
  error: { code: string; message: string };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface WhoAmIData {
  email: string;
}

export interface RoomSummary {
  code: string;
  name: string;
}

export interface RoomMeta {
  code: string;
  name: string;
  createdAt: number;
  creatorEmail: string;
  isClosed: boolean;
}

export interface YouInfo {
  email: string;
  displayName: string;
  score: number;
  isCreator: boolean;
}

export interface PlayerRow {
  email: string;
  displayName: string;
  score: number;
}

export interface RankingRow {
  rank: number;
  email: string;
  displayName: string;
  score: number;
}

export interface RoomEventMeta {
  points?: number;
  note?: string;
  missionId?: string;
  targetEmail?: string;
  targetDisplayName?: string;
}

export type MissionStatusView = "pending" | "succeeded" | "failed";

export interface RoomEventView {
  at: number;
  type: "joined" | "left" | "claimed" | "closed" | "mission_succeeded" | "mission_failed" | "mission_reset";
  by: string;
  meta?: RoomEventMeta;
}

export interface MissionView {
  id: string;
  title: string;
  description?: string;
  points: number;
  difficulty: string;
  tags?: string[];
}

export interface AssignedMissionView {
  mission: MissionView;
  status: MissionStatusView;
  completedAt?: number;
  targetEmail?: string;
  targetDisplayName?: string;
}

export interface MissionsData {
  commonMission: AssignedMissionView;
  personalMissions: AssignedMissionView[];
  score: number;
}

export interface RoomStateData {
  room: RoomMeta;
  you: YouInfo | null;
  players: PlayerRow[];
  ranking: RankingRow[];
  events: RoomEventView[];
}
