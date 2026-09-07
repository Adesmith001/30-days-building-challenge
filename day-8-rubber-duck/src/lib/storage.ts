import type {
  DuckSession,
} from "../schemas/session";

const KEY =
  "rubber-duck:sessions:v1";

export function loadSessions():
  DuckSession[] {
  try {
    const raw =
      localStorage.getItem(KEY);

    return raw
      ? JSON.parse(raw)
      : [];
  } catch {
    return [];
  }
}

export function saveSessions(
  sessions: DuckSession[],
) {
  localStorage.setItem(
    KEY,
    JSON.stringify(sessions),
  );
}

export function clearSessions() {
  localStorage.removeItem(KEY);
}