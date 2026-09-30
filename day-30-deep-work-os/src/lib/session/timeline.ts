import type { SessionEvent } from "@/types";

export interface TimelinePoint {
  id: string;
  label: string;
  timestamp: string;
  percentage: number;
  event: SessionEvent;
}

const labels: Record<SessionEvent["type"], string> = {
  SESSION_STARTED: "START",
  CHECKPOINT_CREATED: "CHECKPOINT",
  THOUGHT_PARKED: "PARK",
  VISIBILITY_HIDDEN: "AWAY",
  VISIBILITY_VISIBLE: "RETURN",
  INTERRUPTION_LABELED: "LABEL",
  PAUSED: "PAUSE",
  RESUMED: "RESUME",
  BREAK_STARTED: "BREAK",
  BREAK_ENDED: "RETURN",
  NEXT_ACTION_CHANGED: "NEXT",
  PLANNED_TIME_COMPLETED: "PLANNED TIME",
  PLANNED_TIME_EXTENDED: "EXTENDED",
  SESSION_COMPLETED: "CLOSED",
  SESSION_ABANDONED: "ABANDONED",
};

export function buildTimeline(
  events: SessionEvent[],
) {
  if (!events.length) {
    return [];
  }

  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() -
      new Date(b.timestamp).getTime(),
  );

  const start = new Date(
    sorted[0].timestamp,
  ).getTime();

  const end = new Date(
    sorted.at(-1)!.timestamp,
  ).getTime();

  const span = Math.max(1, end - start);

  return sorted.map<TimelinePoint>((event) => {
    const at = new Date(event.timestamp).getTime();

    return {
      id: event.id,
      label: labels[event.type],
      timestamp: event.timestamp,
      percentage:
        ((at - start) / span) * 100,
      event,
    };
  });
}