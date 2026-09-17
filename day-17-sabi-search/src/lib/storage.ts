import type {
  GameStats,
  HistoryItem,
} from "../types/game";

const KEY =
  "sabi-search-stats-v1";

export const EMPTY_STATS:
  GameStats = {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalAttempts: 0,

    distribution: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    },

    history: [],
  };

export function loadStats():
  GameStats {
  try {
    const raw =
      localStorage.getItem(KEY);

    return raw
      ? {
          ...EMPTY_STATS,
          ...JSON.parse(raw),
        }
      : EMPTY_STATS;
  } catch {
    return EMPTY_STATS;
  }
}

export function saveResult(
  item: HistoryItem,
) {
  const current =
    loadStats();

  const duplicateDaily =
    current.history.some(
      (entry) =>
        entry.mode === "daily" &&
        entry.date === item.date,
    );

  if (
    item.mode === "daily" &&
    duplicateDaily
  ) {
    return current;
  }

  const wins =
    current.wins +
    (item.won ? 1 : 0);

  const nextStreak =
    item.won
      ? current.currentStreak + 1
      : 0;

  const distribution = {
    ...current.distribution,
  };

  if (item.won) {
    distribution[
      String(item.attempts)
    ] += 1;
  }

  const next: GameStats = {
    played:
      current.played + 1,

    wins,

    currentStreak:
      nextStreak,

    maxStreak: Math.max(
      current.maxStreak,
      nextStreak,
    ),

    totalAttempts:
      current.totalAttempts +
      item.attempts,

    distribution,

    history: [
      item,
      ...current.history,
    ].slice(0, 30),
  };

  localStorage.setItem(
    KEY,
    JSON.stringify(next),
  );

  return next;
}