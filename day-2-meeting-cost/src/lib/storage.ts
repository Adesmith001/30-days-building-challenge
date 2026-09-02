import type { MeetingRecord } from "../types/meeting";

const KEY = "meeting-cost-history-v1";

export function loadHistory(): MeetingRecord[] {
  try {
    const value = localStorage.getItem(KEY);

    if (!value) return [];

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(
  meetings: MeetingRecord[],
) {
  try {
    localStorage.setItem(KEY, JSON.stringify(meetings));
  } catch {
    //
  }
}

export function clearStoredHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    //
  }
}