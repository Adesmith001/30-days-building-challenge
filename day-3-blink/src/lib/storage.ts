import type { StoredStats } from "../types/game";

const STORAGE_KEY = "blink-player-stats";

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