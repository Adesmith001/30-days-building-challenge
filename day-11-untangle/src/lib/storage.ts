import type { Session } from "../types";

const STORAGE_KEY = "untangle:sessions:v1";

function read(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSessions() {
  return read().sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime(),
  );
}

export function getSession(id: string) {
  return read().find((session) => session.id === id) ?? null;
}

export function saveSession(session: Session) {
  const sessions = read();
  const existingIndex = sessions.findIndex(
    (item) => item.id === session.id,
  );

  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.unshift(session);
  }

  write(sessions);
  return session;
}

export function deleteSession(id: string) {
  write(read().filter((session) => session.id !== id));
}

export function clearSessions() {
  localStorage.removeItem(STORAGE_KEY);
}