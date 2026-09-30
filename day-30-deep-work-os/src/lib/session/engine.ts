import type {
  DeepWorkSession,
  SessionStatus,
} from "@/types";

const transitions: Record<
  SessionStatus,
  SessionStatus[]
> = {
  draft: ["preparing", "active", "abandoned"],
  preparing: ["active", "draft", "abandoned"],
  active: ["paused", "break", "completed", "abandoned"],
  paused: ["active", "break", "completed", "abandoned"],
  break: ["active", "completed", "abandoned"],
  completed: [],
  abandoned: [],
};

export function canTransition(
  from: SessionStatus,
  to: SessionStatus,
) {
  return transitions[from].includes(to);
}

export function assertTransition(
  from: SessionStatus,
  to: SessionStatus,
) {
  if (!canTransition(from, to)) {
    throw new Error(
      `Invalid session transition: ${from} → ${to}`,
    );
  }
}

export function sessionIsRunning(
  session?: DeepWorkSession | null,
) {
  return Boolean(
    session &&
      ["active", "paused", "break"].includes(
        session.status,
      ),
  );
}