import type { Env } from "../../lib/env.ts";
import type { MissionStatus } from "../../lib/types.ts";
import { badRequest } from "../../lib/errors.ts";
import { getUserEmail } from "../../lib/headers.ts";
import { handleError } from "../../lib/handler.ts";
import { readJson } from "../../lib/json.ts";
import { jsonResponse } from "../../lib/json.ts";
import { getMissionsData, setMissionStatus } from "../../lib/store.ts";
import { validateRoomCode } from "../../lib/validate.ts";

const VALID_STATUSES: MissionStatus[] = ["pending", "succeeded", "failed"];

interface CompleteBody {
  code?: unknown;
  missionId?: unknown;
  status?: unknown;
  targetEmail?: unknown;
}

function validateMissionId(id: unknown): string {
  if (typeof id !== "string" || !id.trim()) {
    throw badRequest("missionId must be a non-empty string");
  }
  return id.trim();
}

function validateStatus(v: unknown): MissionStatus {
  if (typeof v !== "string" || !VALID_STATUSES.includes(v as MissionStatus)) {
    throw badRequest("status must be one of: pending, succeeded, failed");
  }
  return v as MissionStatus;
}

function validateTargetEmail(v: unknown): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v !== "string" || !v.trim()) return undefined;
  return v.trim();
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  try {
    const email = getUserEmail(context.request);
    const body = await readJson<CompleteBody>(context.request);
    const code = validateRoomCode(body.code);
    const missionId = validateMissionId(body.missionId);
    const status = validateStatus(body.status);
    const targetEmail = validateTargetEmail(body.targetEmail);
    await setMissionStatus(context.env.ROOMS_KV, code, email, missionId, status, targetEmail);
    const data = await getMissionsData(context.env.ROOMS_KV, code, email);
    return jsonResponse({ ok: true, data });
  } catch (err) {
    return handleError(err);
  }
}
