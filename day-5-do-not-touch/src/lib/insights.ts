import type { RunStats } from "../types/game";

export function getInsight(stats: RunStats) {
  if (stats.misses >= 15) {
    return "Speed no be your problem, na patience. You dey rush the whole thing.";
  }

  if (stats.cleanCatches >= 7) {
    return "You no waste movement at all. Precision carry you pass raw speed.";
  }

  if (
    stats.fastestCatchMs !== null &&
    stats.fastestCatchMs < 1200
  ) {
    return "Your fastest catches sharp well. Na the predictive stages slow you down pass reflex ones.";
  }

  if (stats.bestStreak >= 5) {
    return "You catch the new movement rules quick quick. Your streak survive plenty mechanic changes.";
  }

  if (stats.misses <= 5) {
    return "You barely miss. You take am steady, and e work.";
  }

  return "You improve as the game become less predictable. This button hard to fool, but you still chase am.";
}