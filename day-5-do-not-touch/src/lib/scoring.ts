import type { CatchSummary, LevelConfig } from "../types/game";

function streakMultiplier(streak: number) {
  if (streak >= 5) return 1.6;
  if (streak === 4) return 1.4;
  if (streak === 3) return 1.25;
  if (streak === 2) return 1.1;
  return 1;
}

export function scoreCatch(
  level: LevelConfig,
  elapsedMs: number,
  misses: number,
  streak: number,
): CatchSummary {
  const base = 200;
  const targetMs = 3200 + level.id * 120;

  const speedBonus = Math.min(
    250,
    Math.max(0, Math.round((targetMs - elapsedMs) / 10)),
  );

  const clean = misses === 0;
  const fast = elapsedMs <= 2200;
  const perfect = level.id >= 4 && clean && elapsedMs <= 1700;

  const cleanBonus = clean ? 150 : 0;
  const perfectBonus = perfect ? 300 : 0;

  const multiplied =
    base * level.difficulty * streakMultiplier(streak);

  const points = Math.round(
    multiplied + speedBonus + cleanBonus + perfectBonus,
  );

  let label = "CAUGHT.";

  if (clean) label = "CLEAN CATCH";
  if (fast) label = "GOTCHA";
  if (perfect) label = "PERFECT CATCH";

  return {
    elapsedMs,
    misses,
    points,
    clean,
    fast,
    perfect,
    streak,
    label,
  };
}