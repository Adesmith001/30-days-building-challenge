import { db } from "@/lib/storage/db";
import { queueUpsert } from "@/lib/storage/queue";
import { assertTransition } from "@/lib/session/engine";
import { uid } from "@/lib/utils";

import type {
  DeepWorkSession,
  ResultStatus,
  SessionEvent,
  SessionResource,
} from "@/types";

interface NewSessionInput {
  outcome: string;
  definitionOfDone: string;
  firstAction: string;
  notDoing?: string;
  resources?: SessionResource[];
  mode: "timed" | "open";
  plannedDurationSeconds?: number | null;
  projectId?: string | null;
  continuedFromSessionId?: string | null;
}

async function addEvent(
  sessionId: string,
  type: SessionEvent["type"],
  metadata?: Record<string, unknown>,
) {
  const event: SessionEvent = {
    id: uid(),
    sessionId,
    type,
    timestamp: new Date().toISOString(),
    metadata,
  };

  await db.sessionEvents.add(event);

  await queueUpsert(
    "session_events",
    event.id,
    event,
  );

  return event;
}

async function saveSession(
  session: DeepWorkSession,
) {
  await db.sessions.put(session);
  await queueUpsert("sessions", session.id, session);
}

export async function createSession(
  input: NewSessionInput,
) {
  const now = new Date().toISOString();

  const session: DeepWorkSession = {
    id: uid(),
    projectId: input.projectId,
    continuedFromSessionId:
      input.continuedFromSessionId,

    outcome: input.outcome.trim(),
    definitionOfDone: input.definitionOfDone.trim(),
    firstAction: input.firstAction.trim(),
    currentNextAction: input.firstAction.trim(),
    notDoing: input.notDoing?.trim(),

    resources: input.resources ?? [],

    mode: input.mode,
    plannedDurationSeconds:
      input.mode === "timed"
        ? input.plannedDurationSeconds
        : null,

    status: "draft",
    resultStatus: null,

    totalPausedMs: 0,
    totalBreakMs: 0,

    createdAt: now,
    updatedAt: now,
  };

  await saveSession(session);

  return session;
}

export async function markPreparing(id: string) {
  const session = await db.sessions.get(id);

  if (!session) {
    throw new Error("Session not found");
  }

  assertTransition(session.status, "preparing");

  session.status = "preparing";
  session.updatedAt = new Date().toISOString();

  await saveSession(session);
}

export async function startSession(id: string) {
  const session = await db.sessions.get(id);

  if (!session) {
    throw new Error("Session not found");
  }

  assertTransition(session.status, "active");

  const now = new Date().toISOString();

  session.status = "active";
  session.startedAt = now;
  session.updatedAt = now;

  await saveSession(session);
  await addEvent(id, "SESSION_STARTED");

  return session;
}

export async function pauseSession(id: string) {
  const session = await db.sessions.get(id);

  if (!session || session.status !== "active") {
    return;
  }

  const now = new Date().toISOString();

  session.status = "paused";
  session.pauseStartedAt = now;
  session.updatedAt = now;

  await saveSession(session);
  await addEvent(id, "PAUSED");
}

export async function resumeSession(id: string) {
  const session = await db.sessions.get(id);

  if (!session || session.status !== "paused") {
    return;
  }

  const nowMs = Date.now();

  if (session.pauseStartedAt) {
    session.totalPausedMs +=
      nowMs -
      new Date(session.pauseStartedAt).getTime();
  }

  session.status = "active";
  session.pauseStartedAt = null;
  session.updatedAt = new Date(nowMs).toISOString();

  await saveSession(session);
  await addEvent(id, "RESUMED");
}

export async function startBreak(
  id: string,
  minutes = 10,
) {
  const session = await db.sessions.get(id);

  if (!session) {
    return;
  }

  const nowMs = Date.now();

  if (session.status === "paused") {
    if (session.pauseStartedAt) {
      session.totalPausedMs +=
        nowMs -
        new Date(session.pauseStartedAt).getTime();
    }

    session.pauseStartedAt = null;
  } else if (session.status !== "active") {
    return;
  }

  session.status = "break";
  session.breakStartedAt =
    new Date(nowMs).toISOString();
  session.breakEndsAt = new Date(
    nowMs + minutes * 60_000,
  ).toISOString();

  session.updatedAt = new Date(nowMs).toISOString();

  await saveSession(session);

  await addEvent(id, "BREAK_STARTED", {
    plannedMinutes: minutes,
  });
}

export async function finishBreak(id: string) {
  const session = await db.sessions.get(id);

  if (!session || session.status !== "break") {
    return;
  }

  const nowMs = Date.now();

  if (session.breakStartedAt) {
    session.totalBreakMs +=
      nowMs -
      new Date(session.breakStartedAt).getTime();
  }

  session.status = "active";
  session.breakStartedAt = null;
  session.breakEndsAt = null;
  session.updatedAt = new Date(nowMs).toISOString();

  await saveSession(session);
  await addEvent(id, "BREAK_ENDED");
}

export async function parkThought(
  sessionId: string,
  text: string,
) {
  const item = {
    id: uid(),
    sessionId,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    resolved: false,
  };

  await db.parkedItems.add(item);

  await queueUpsert(
    "parked_items",
    item.id,
    item,
  );

  await addEvent(sessionId, "THOUGHT_PARKED", {
    parkedItemId: item.id,
  });

  return item;
}

export async function createCheckpoint(
  sessionId: string,
  summary: string,
  nextAction: string,
) {
  const session = await db.sessions.get(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  const checkpoint = {
    id: uid(),
    sessionId,
    summary: summary.trim(),
    nextAction: nextAction.trim(),
    createdAt: new Date().toISOString(),
  };

  session.currentNextAction =
    checkpoint.nextAction;
  session.updatedAt = checkpoint.createdAt;

  await db.transaction(
    "rw",
    db.sessions,
    db.checkpoints,
    async () => {
      await db.checkpoints.add(checkpoint);
      await db.sessions.put(session);
    },
  );

  await queueUpsert(
    "checkpoints",
    checkpoint.id,
    checkpoint,
  );

  await queueUpsert(
    "sessions",
    session.id,
    session,
  );

  await addEvent(
    sessionId,
    "CHECKPOINT_CREATED",
    {
      checkpointId: checkpoint.id,
      summary: checkpoint.summary,
      nextAction: checkpoint.nextAction,
    },
  );

  return checkpoint;
}

export async function updateNextAction(
  sessionId: string,
  nextAction: string,
) {
  const session = await db.sessions.get(sessionId);

  if (!session) {
    return;
  }

  session.currentNextAction = nextAction.trim();
  session.updatedAt = new Date().toISOString();

  await saveSession(session);

  await addEvent(
    sessionId,
    "NEXT_ACTION_CHANGED",
    {
      nextAction: session.currentNextAction,
    },
  );
}

export async function recordVisibilityHidden(
  sessionId: string,
) {
  return addEvent(
    sessionId,
    "VISIBILITY_HIDDEN",
  );
}

export async function recordVisibilityVisible(
  sessionId: string,
  hiddenAt: string,
  durationMs: number,
) {
  return addEvent(
    sessionId,
    "VISIBILITY_VISIBLE",
    {
      hiddenAt,
      durationMs,
    },
  );
}

export async function labelInterruption(
  sessionId: string,
  label: string,
  visibleEventId?: string,
) {
  return addEvent(
    sessionId,
    "INTERRUPTION_LABELED",
    {
      label,
      visibleEventId,
    },
  );
}

export async function recordPlannedComplete(
  sessionId: string,
) {
  const existing = await db.sessionEvents
    .where("sessionId")
    .equals(sessionId)
    .filter(
      (event) =>
        event.type === "PLANNED_TIME_COMPLETED",
    )
    .first();

  if (existing) {
    return;
  }

  await addEvent(
    sessionId,
    "PLANNED_TIME_COMPLETED",
  );
}

export async function extendSession(
  id: string,
  seconds: number,
) {
  const session = await db.sessions.get(id);

  if (!session || session.mode !== "timed") {
    return;
  }

  session.plannedDurationSeconds =
    (session.plannedDurationSeconds ?? 0) +
    seconds;

  session.updatedAt = new Date().toISOString();

  await saveSession(session);

  await addEvent(
    id,
    "PLANNED_TIME_EXTENDED",
    { seconds },
  );
}

interface FinishDetails {
  completionNote?: string;
  finalNextStep?: string;
  blocker?: string;
  directionChange?: string;
}

export async function finishSession(
  id: string,
  resultStatus: ResultStatus,
  details: FinishDetails = {},
) {
  const session = await db.sessions.get(id);

  if (!session) {
    throw new Error("Session not found");
  }

  const nowMs = Date.now();

  if (
    session.status === "paused" &&
    session.pauseStartedAt
  ) {
    session.totalPausedMs +=
      nowMs -
      new Date(session.pauseStartedAt).getTime();
  }

  if (
    session.status === "break" &&
    session.breakStartedAt
  ) {
    session.totalBreakMs +=
      nowMs -
      new Date(session.breakStartedAt).getTime();
  }

  session.status = "completed";
  session.resultStatus = resultStatus;
  session.endedAt =
    new Date(nowMs).toISOString();

  session.pauseStartedAt = null;
  session.breakStartedAt = null;
  session.breakEndsAt = null;

  session.completionNote =
    details.completionNote?.trim();

  session.finalNextStep =
    details.finalNextStep?.trim();

  session.blocker = details.blocker?.trim();

  session.directionChange =
    details.directionChange?.trim();

  session.updatedAt = session.endedAt;

  await saveSession(session);

  await addEvent(id, "SESSION_COMPLETED", {
    resultStatus,
  });

  return session;
}

export async function abandonSession(id: string) {
  const session = await db.sessions.get(id);

  if (!session) {
    return;
  }

  session.status = "abandoned";
  session.endedAt = new Date().toISOString();
  session.updatedAt = session.endedAt;

  await saveSession(session);

  await addEvent(id, "SESSION_ABANDONED");
}

export async function endAtLastCheckpoint(
  id: string,
) {
  const session = await db.sessions.get(id);

  const checkpoint = await db.checkpoints
    .where("sessionId")
    .equals(id)
    .last();

  if (!session || !checkpoint) {
    return;
  }

  session.status = "completed";
  session.resultStatus = "partial";
  session.endedAt = checkpoint.createdAt;
  session.finalNextStep = checkpoint.nextAction;
  session.updatedAt = new Date().toISOString();

  await saveSession(session);

  await addEvent(id, "SESSION_COMPLETED", {
    resultStatus: "partial",
    endedAtLastCheckpoint: true,
  });
}