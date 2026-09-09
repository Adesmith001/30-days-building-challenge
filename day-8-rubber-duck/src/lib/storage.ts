import type {
  DuckSession,
} from "../schemas/session";

import {
  sessionMessages,
} from "./chat";

const KEY =
  "rubber-duck:sessions:v1";

export function loadSessions():
  DuckSession[] {
  try {
    const raw =
      localStorage.getItem(KEY);

    const sessions = raw
      ? JSON.parse(raw) as DuckSession[]
      : [];

    return sessions.map((session) => ({
      ...session,
      messages:
        session.messages ??
        sessionMessages(session),
    }));
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
