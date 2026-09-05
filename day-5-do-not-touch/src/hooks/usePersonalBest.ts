import { useCallback, useState } from "react";
import type {
  PersonalBest,
  RunStats,
} from "../types/game";

const STORAGE_KEY = "do-not-touch-personal-best";

const defaults: PersonalBest = {
  score: 0,
  fastestRunMs: null,
  fewestMisses: null,
  fastestCatchMs: null,
  bestStreak: 0,
};

function loadBest(): PersonalBest {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return defaults;

    return {
      ...defaults,
      ...JSON.parse(raw),
    };
  } catch {
    return defaults;
  }
}

export function usePersonalBest() {
  const [best, setBest] = useState<PersonalBest>(loadBest);
  const [lastUpdates, setLastUpdates] = useState<string[]>([]);

  const saveRun = useCallback(
    (stats: RunStats) => {
      const updates: string[] = [];
      const next = { ...best };

      if (stats.score > best.score) {
        next.score = stats.score;
        updates.push("score");
      }

      if (
        best.fastestRunMs === null ||
        stats.totalTimeMs < best.fastestRunMs
      ) {
        next.fastestRunMs = stats.totalTimeMs;
        updates.push("time");
      }

      if (
        best.fewestMisses === null ||
        stats.misses < best.fewestMisses
      ) {
        next.fewestMisses = stats.misses;
        updates.push("misses");
      }

      if (
        stats.fastestCatchMs !== null &&
        (best.fastestCatchMs === null ||
          stats.fastestCatchMs < best.fastestCatchMs)
      ) {
        next.fastestCatchMs = stats.fastestCatchMs;
        updates.push("catch");
      }

      if (stats.bestStreak > best.bestStreak) {
        next.bestStreak = stats.bestStreak;
        updates.push("streak");
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next),
      );

      setBest(next);
      setLastUpdates(updates);
    },
    [best],
  );

  return {
    best,
    lastUpdates,
    saveRun,
  };
}