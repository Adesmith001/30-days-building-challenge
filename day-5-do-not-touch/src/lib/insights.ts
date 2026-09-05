import type { RunStats } from "../types/game";

export function getInsight(stats: RunStats) {
  if (stats.misses >= 15) {
    return "You're fast, but impatient. Most of the damage came from aggressive attempts.";
  }

  if (stats.cleanCatches >= 7) {
    return "Very little wasted movement. Precision did more work than raw speed.";
  }

  if (
    stats.fastestCatchMs !== null &&
    stats.fastestCatchMs < 1200
  ) {
    return "Your fastest catches were extremely sharp. Predictive stages slowed you down more than reflex stages.";
  }

  if (stats.bestStreak >= 5) {
    return "You adapted quickly once the movement rules changed. Your streak survived several mechanic shifts.";
  }

  if (stats.misses <= 5) {
    return "You barely missed. The trade-off was a more deliberate approach speed.";
  }

  return "Your run improved as the mechanics became less predictable. The button was harder to fool than to chase.";
}