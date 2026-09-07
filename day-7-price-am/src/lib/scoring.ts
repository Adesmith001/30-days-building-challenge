import type {
  PriceItem,
  RoundResult,
} from "../types/game";

export function streakMultiplier(streak: number) {
  if (streak >= 5) return 1.6;
  if (streak === 4) return 1.4;
  if (streak === 3) return 1.25;
  if (streak === 2) return 1.1;

  return 1;
}

function getBasePoints(errorPercent: number, exact: boolean) {
  if (exact) return 1500;
  if (errorPercent <= 2) return 1200;
  if (errorPercent <= 5) return 900;
  if (errorPercent <= 10) return 750;
  if (errorPercent <= 20) return 550;
  if (errorPercent <= 30) return 350;
  if (errorPercent <= 50) return 150;

  return 50;
}

function getVerdict(errorPercent: number, direction: string) {
  if (errorPercent === 0) return "NA PRICE YOU BORN TO KNOW";
  if (errorPercent <= 2) return "YOU SABI MARKET WELL";
  if (errorPercent <= 10) return "YOU GET PRICE SENSE";
  if (errorPercent <= 20) return "E CLOSE SMALL";
  if (direction === "low") return "ABEG DROP YOUR VENDOR NUMBER";

  return "FOR THIS ECONOMY?";
}

export function scoreGuess(
  item: PriceItem,
  guess: number,
  currentStreak: number,
  elapsedMs: number,
): RoundResult {
  const error = Math.abs(guess - item.actualPrice);
  const errorPercent = (error / item.actualPrice) * 100;
  const exact = guess === item.actualPrice;

  const accuracy = Math.max(
    0,
    Math.round(100 - errorPercent),
  );

  const nextStreak =
    errorPercent <= 15 ? currentStreak + 1 : 0;

  const multiplier =
    nextStreak > 0 ? streakMultiplier(nextStreak) : 1;

  const basePoints = getBasePoints(errorPercent, exact);

  const speedBonus =
    elapsedMs <= 5000 && errorPercent <= 10 ? 100 : 0;

  const points =
    Math.round(basePoints * multiplier) + speedBonus;

  const direction =
    exact
      ? "exact"
      : guess < item.actualPrice
        ? "low"
        : "high";

  return {
    item,
    guess,
    skipped: false,
    direction,
    error,
    errorPercent,
    accuracy,
    basePoints,
    speedBonus,
    multiplier,
    points,
    nextStreak,
    verdict: getVerdict(errorPercent, direction),
  };
}

export function scoreSkip(
  item: PriceItem,
  currentStreak: number,
): RoundResult {
  return {
    item,
    guess: null,
    skipped: true,
    direction: "skip",
    error: 0,
    errorPercent: 100,
    accuracy: 0,
    basePoints: 0,
    speedBonus: 0,
    multiplier: 1,
    points: 0,
    nextStreak: currentStreak,
    verdict: "PASSED",
  };
}
