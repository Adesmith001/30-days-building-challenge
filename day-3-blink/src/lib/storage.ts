import type {
  SessionRecord,
  StoredStats,
} from "../types/game";

const STORAGE_KEY = "blink-player-stats";
const RECORDS_KEY = "blink-session-records";
const MAX_RECORDS = 20;

export const defaultStoredStats: StoredStats = {
  personalBest: 0,
  highestStreak: 0,
  shortestThreshold: 500,
  sessionsPlayed: 0,
};

export function loadStats(): StoredStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultStoredStats;
    }

    return {
      ...defaultStoredStats,
      ...JSON.parse(raw),
    };
  } catch {
    return defaultStoredStats;
  }
}

export function saveStats(stats: StoredStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function loadRecords(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);

    if (!raw) {
      return [];
    }

    const records = JSON.parse(raw);
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

export function saveRecord(record: SessionRecord) {
  const records = [record, ...loadRecords()].slice(0, MAX_RECORDS);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  return records;
}