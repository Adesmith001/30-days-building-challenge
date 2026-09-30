import type {
  DailyPlan,
  DeepWorkSession,
  ParkedItem,
  Project,
  SessionCheckpoint,
  SessionEvent,
  SyncEntity,
} from "@/types";

export function toRemote(
  entity: SyncEntity,
  payload: unknown,
  userId: string,
) {
  switch (entity) {
    case "sessions": {
      const s = payload as DeepWorkSession;

      return {
        id: s.id,
        user_id: userId,
        project_id: s.projectId ?? null,
        continued_from_session_id:
          s.continuedFromSessionId ?? null,
        outcome: s.outcome,
        definition_of_done: s.definitionOfDone,
        first_action: s.firstAction,
        current_next_action:
          s.currentNextAction,
        not_doing: s.notDoing ?? null,
        resources: s.resources,
        mode: s.mode,
        planned_duration_seconds:
          s.plannedDurationSeconds ?? null,
        status: s.status,
        result_status:
          s.resultStatus ?? null,
        started_at: s.startedAt ?? null,
        ended_at: s.endedAt ?? null,
        pause_started_at:
          s.pauseStartedAt ?? null,
        break_started_at:
          s.breakStartedAt ?? null,
        break_ends_at:
          s.breakEndsAt ?? null,
        total_paused_ms: s.totalPausedMs,
        total_break_ms: s.totalBreakMs,
        completion_note:
          s.completionNote ?? null,
        final_next_step:
          s.finalNextStep ?? null,
        blocker: s.blocker ?? null,
        direction_change:
          s.directionChange ?? null,
        created_at: s.createdAt,
        updated_at: s.updatedAt,
      };
    }

    case "session_events": {
      const e = payload as SessionEvent;

      return {
        id: e.id,
        session_id: e.sessionId,
        user_id: userId,
        type: e.type,
        timestamp: e.timestamp,
        metadata: e.metadata ?? {},
      };
    }

    case "checkpoints": {
      const c =
        payload as SessionCheckpoint;

      return {
        id: c.id,
        session_id: c.sessionId,
        user_id: userId,
        summary: c.summary,
        next_action: c.nextAction,
        created_at: c.createdAt,
      };
    }

    case "parked_items": {
      const p = payload as ParkedItem;

      return {
        id: p.id,
        session_id: p.sessionId,
        user_id: userId,
        text: p.text,
        resolved: p.resolved,
        created_at: p.createdAt,
      };
    }

    case "projects": {
      const p = payload as Project;

      return {
        id: p.id,
        user_id: userId,
        name: p.name,
        archived: p.archived,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      };
    }

    case "daily_plans": {
      const p = payload as DailyPlan;

      return {
        id: p.id,
        user_id: userId,
        date: p.date,
        items: p.items,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      };
    }
  }
}