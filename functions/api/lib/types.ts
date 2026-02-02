/** Room code: 4–5 uppercase chars, no ambiguous (I,O,0,1). */
export type RoomCode = string;

/** User identity (name, nickname, or email) from X-User-Identity header. Used as player key. */
export type Email = string;

export type Timestamp = number;

export interface Mission {
  id: string;
  title: string;
  description?: string;
  points: number;
  difficulty: "easy" | "medium" | "hard" | "legendary";
  tags?: string[];
}

export type MissionStatus = "pending" | "succeeded" | "failed";

export interface AssignedMission {
  missionId: string;
  status: MissionStatus;
  completedAt?: Timestamp;
  /** When succeeded/failed: the other player this mission was for (who you got, or who got you). */
  targetEmail?: Email;
}

export interface Player {
  email: Email;
  displayName: string;
  /** Score is derived from completed missions; do not set directly. */
  score: number;
  joinedAt: Timestamp;
  assignedMissions: AssignedMission[];
}

export type EventType =
  | "joined"
  | "left"
  | "claimed"
  | "closed"
  | "mission_succeeded"
  | "mission_failed"
  | "mission_reset";

export interface RoomEvent {
  at: Timestamp;
  type: EventType;
  by: Email;
  meta?: {
    points?: number;
    note?: string;
    missionId?: string;
    status?: MissionStatus;
    targetEmail?: string;
    targetDisplayName?: string;
  };
}

export interface Room {
  code: RoomCode;
  name: string;
  createdAt: Timestamp;
  creatorEmail: Email;
  isClosed: boolean;
  commonMissionId: string;
  missionDeckVersion?: string;
  players: Record<Email, Player>;
  events: RoomEvent[];
}

export const MAX_EVENTS = 50;
