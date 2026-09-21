import type { Difficulty } from "../types/game";

export function scoreFor(difficulty: Difficulty, streak: number) {
  const base = difficulty === "hard" ? 750 : difficulty === "medium" ? 500 : 300;
  return base + Math.min(streak * 50, 500);
}

export function arenaLevel(trophies: number) {
  return Math.min(5, Math.floor(trophies / 10) + 1);
}
