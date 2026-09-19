import type {
  RoundResult,
} from "../types/game";

import {
  isOneAdjacentSwapAway,
} from "./ordering";

export function scoreRound(
  puzzleId: string,
  playerOrder: string[],
  correctOrder: string[],
  durationMs: number,
  hintUsed: boolean,
): RoundResult {
  const exactPositions =
    playerOrder.reduce(
      (
        total,
        id,
        index,
      ) =>
        total +
        Number(
          id ===
            correctOrder[index],
        ),
      0,
    );

  const perfect =
    exactPositions ===
    correctOrder.length;

  const raw =
    exactPositions * 200 +
    (perfect ? 200 : 0);

  const points =
    Math.min(
      raw,
      hintUsed ? 800 : 1000,
    );

  return {
    puzzleId,
    playerOrder,
    correctOrder,
    exactPositions,
    points,
    durationMs,
    hintUsed,
    perfect,
    nearMiss:
      !perfect &&
      isOneAdjacentSwapAway(
        playerOrder,
        correctOrder,
      ),
  };
}

export function getRank(
  score: number,
) {
  if (score >= 8500) {
    return "SORTED.";
  }

  if (score >= 6500) {
    return "SHARP SORTER";
  }

  if (score >= 4500) {
    return "IN ORDER";
  }

  if (score >= 2500) {
    return "GETTING THERE";
  }

  return "CHAOS";
}

export function roundPhase(
  index: number,
  total: number,
) {
  if (
    index === total - 1
  ) {
    return "FINAL SORT";
  }

  if (index < 3) {
    return "WARM UP";
  }

  if (index < 6) {
    return "GETTING TRICKY";
  }

  return "THINK.";
}

export function formatTime(
  ms?: number,
) {
  if (!ms) {
    return "—";
  }

  return `${
    (ms / 1000).toFixed(1)
  }s`;
}