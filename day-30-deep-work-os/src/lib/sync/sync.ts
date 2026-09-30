import { db } from "@/lib/storage/db";
import {
  createSupabaseBrowser,
} from "@/lib/supabase/browser";
import { toRemote } from "@/lib/sync/mapper";
import { useSyncStore } from "@/stores/sync-store";
import type { SyncEntity } from "@/types";

export async function syncAll() {
  const supabase = createSupabaseBrowser();

  if (!supabase) {
    useSyncStore
      .getState()
      .setStatus("local");

    return;
  }

  if (!navigator.onLine) {
    useSyncStore
      .getState()
      .setStatus("offline");

    return;
  }

  const { data } =
    await supabase.auth.getUser();

  const user = data.user;

  if (!user) {
    useSyncStore
      .getState()
      .setStatus("local");

    return;
  }

  useSyncStore
    .getState()
    .setStatus("syncing");

  try {
    await pushQueue(user.id);
    await pullRemote(user.id);

    useSyncStore
      .getState()
      .markSynced();
  } catch (error) {
    console.error(error);

    useSyncStore
      .getState()
      .setStatus("issue");
  }
}

async function pushQueue(userId: string) {
  const supabase = createSupabaseBrowser();

  if (!supabase) return;

  const queue = await db.syncQueue
    .orderBy("createdAt")
    .toArray();

  for (const item of queue) {
    try {
      if (item.operation === "delete") {
        const { error } = await supabase
          .from(item.entity)
          .delete()
          .eq("id", item.recordId);

        if (error) throw error;
      } else {
        const remote = toRemote(
          item.entity,
          item.payload,
          userId,
        );

        const { error } = await supabase
          .from(item.entity)
          .upsert(remote as never);

        if (error) throw error;
      }

      await db.syncQueue.delete(item.id);
    } catch (error) {
      await db.syncQueue.update(item.id, {
        attempts: item.attempts + 1,
      });

      throw error;
    }
  }
}

async function pullRemote(userId: string) {
  const supabase = createSupabaseBrowser();

  if (!supabase) return;

  const entities: SyncEntity[] = [
    "sessions",
    "session_events",
    "checkpoints",
    "parked_items",
    "projects",
    "daily_plans",
  ];

  for (const entity of entities) {
    const { data, error } = await supabase
      .from(entity)
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    if (!data) continue;

    await mergeEntity(entity, data);
  }
}

async function mergeEntity(
  entity: SyncEntity,
  rows: Record<string, unknown>[],
) {
  switch (entity) {
    case "sessions":
      await db.sessions.bulkPut(
        rows.map((r) => ({
          id: String(r.id),
          projectId:
            (r.project_id as string) ?? null,
          continuedFromSessionId:
            (r.continued_from_session_id as string) ??
            null,
          outcome: String(r.outcome),
          definitionOfDone: String(
            r.definition_of_done,
          ),
          firstAction: String(r.first_action),
          currentNextAction: String(
            r.current_next_action,
          ),
          notDoing:
            (r.not_doing as string) ?? undefined,
          resources:
            (r.resources as never[]) ?? [],
          mode: r.mode as "timed" | "open",
          plannedDurationSeconds:
            (r.planned_duration_seconds as number) ??
            null,
          status: r.status as never,
          resultStatus:
            (r.result_status as never) ?? null,
          startedAt:
            (r.started_at as string) ?? null,
          endedAt:
            (r.ended_at as string) ?? null,
          pauseStartedAt:
            (r.pause_started_at as string) ?? null,
          breakStartedAt:
            (r.break_started_at as string) ?? null,
          breakEndsAt:
            (r.break_ends_at as string) ?? null,
          totalPausedMs:
            Number(r.total_paused_ms) || 0,
          totalBreakMs:
            Number(r.total_break_ms) || 0,
          completionNote:
            (r.completion_note as string) ??
            undefined,
          finalNextStep:
            (r.final_next_step as string) ??
            undefined,
          blocker:
            (r.blocker as string) ?? undefined,
          directionChange:
            (r.direction_change as string) ??
            undefined,
          createdAt: String(r.created_at),
          updatedAt: String(r.updated_at),
        })),
      );
      return;

    case "session_events":
      await db.sessionEvents.bulkPut(
        rows.map((r) => ({
          id: String(r.id),
          sessionId: String(r.session_id),
          type: r.type as never,
          timestamp: String(r.timestamp),
          metadata:
            (r.metadata as Record<
              string,
              unknown
            >) ?? {},
        })),
      );
      return;

    case "checkpoints":
      await db.checkpoints.bulkPut(
        rows.map((r) => ({
          id: String(r.id),
          sessionId: String(r.session_id),
          summary: String(r.summary),
          nextAction: String(r.next_action),
          createdAt: String(r.created_at),
        })),
      );
      return;

    case "parked_items":
      await db.parkedItems.bulkPut(
        rows.map((r) => ({
          id: String(r.id),
          sessionId: String(r.session_id),
          text: String(r.text),
          resolved: Boolean(r.resolved),
          createdAt: String(r.created_at),
        })),
      );
      return;

    case "projects":
      await db.projects.bulkPut(
        rows.map((r) => ({
          id: String(r.id),
          name: String(r.name),
          archived: Boolean(r.archived),
          createdAt: String(r.created_at),
          updatedAt: String(r.updated_at),
        })),
      );
      return;

    case "daily_plans":
      await db.dailyPlans.bulkPut(
        rows.map((r) => ({
          id: String(r.id),
          date: String(r.date),
          items: (r.items as never[]) ?? [],
          createdAt: String(r.created_at),
          updatedAt: String(r.updated_at),
        })),
      );
  }
}