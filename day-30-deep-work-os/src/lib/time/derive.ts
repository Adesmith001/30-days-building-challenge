import type { DeepWorkSession } from "@/types";

export interface TimerState {
  activeElapsedMs: number;
  remainingMs: number | null;
  overtimeMs: number;
  progress: number;
  isComplete: boolean;
}

export function deriveTimerState(
  session: DeepWorkSession,
  nowMs = Date.now(),
): TimerState {
  if (!session.startedAt) {
    return {
      activeElapsedMs: 0,
      remainingMs:
        session.mode === "timed"
          ? (session.plannedDurationSeconds ?? 0) * 1000
          : null,
      overtimeMs: 0,
      progress: 0,
      isComplete: false,
    };
  }

  const startedAt = new Date(session.startedAt).getTime();
  const end = session.endedAt
    ? new Date(session.endedAt).getTime()
    : nowMs;

  let excludedMs = session.totalPausedMs + session.totalBreakMs;

  if (
    session.status === "paused" &&
    session.pauseStartedAt
  ) {
    excludedMs +=
      end - new Date(session.pauseStartedAt).getTime();
  }

  if (
    session.status === "break" &&
    session.breakStartedAt
  ) {
    excludedMs +=
      end - new Date(session.breakStartedAt).getTime();
  }

  const activeElapsedMs = Math.max(
    0,
    end - startedAt - excludedMs,
  );

  if (session.mode === "open") {
    return {
      activeElapsedMs,
      remainingMs: null,
      overtimeMs: 0,
      progress: 0,
      isComplete: false,
    };
  }

  const plannedMs =
    (session.plannedDurationSeconds ?? 0) * 1000;

  const remainingMs = plannedMs - activeElapsedMs;
  const overtimeMs = Math.max(0, -remainingMs);

  return {
    activeElapsedMs,
    remainingMs,
    overtimeMs,
    progress:
      plannedMs > 0
        ? Math.min(activeElapsedMs / plannedMs, 1)
        : 0,
    isComplete: remainingMs <= 0,
  };
}