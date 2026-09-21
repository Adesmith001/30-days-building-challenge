import type { ProgressData } from "../types/game";

const key = "state-fight-progress-v1";

export const defaultProgress: ProgressData = {
  trophies: 0, discovered: [], bestScore: 0, bestStreak: 0, runsCompleted: 0, history: [],
  settings: { sound: true, fastBattles: false },
};

export function loadProgress(): ProgressData {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "{}");
    return { ...defaultProgress, ...saved, settings: { ...defaultProgress.settings, ...saved.settings } };
  } catch { return defaultProgress; }
}

export function saveProgress(progress: ProgressData) {
  localStorage.setItem(key, JSON.stringify(progress));
}
