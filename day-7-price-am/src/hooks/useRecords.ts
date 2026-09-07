import { useState } from "react";
import {
  loadRecords,
  saveRecords,
} from "../lib/storage";
import type {
  MarketRecords,
  RoundResult,
} from "../types/game";

function averageAccuracy(results: RoundResult[]) {
  const answered = results.filter(
    (result) => !result.skipped,
  );

  if (!answered.length) return 0;

  return Math.round(
    answered.reduce(
      (total, result) => total + result.accuracy,
      0,
    ) / answered.length,
  );
}

export function useRecords() {
  const [records, setRecords] =
    useState<MarketRecords>(loadRecords);

  function recordRun(results: RoundResult[]) {
    const score = results.reduce(
      (total, result) => total + result.points,
      0,
    );

    const skips = results.filter(
      (result) => result.skipped,
    ).length;

    const answered = results.filter(
      (result) => !result.skipped,
    );

    const closest =
      answered.length > 0
        ? Math.min(
            ...answered.map(
              (result) => result.errorPercent,
            ),
          )
        : null;

    const bestStreak = Math.max(
      0,
      ...results.map((result) => result.nextStreak),
    );

    const totalValue = answered.reduce(
      (total, result) =>
        total + result.item.actualPrice,
      0,
    );

    const next: MarketRecords = {
      bestScore: Math.max(records.bestScore, score),
      bestAccuracy: Math.max(
        records.bestAccuracy,
        averageAccuracy(results),
      ),
      bestStreak: Math.max(
        records.bestStreak,
        bestStreak,
      ),
      closestPercent:
        records.closestPercent === null
          ? closest
          : closest === null
            ? records.closestPercent
            : Math.min(records.closestPercent, closest),
      lowestSkips:
        records.lowestSkips === null
          ? skips
          : Math.min(records.lowestSkips, skips),
      gamesPlayed: records.gamesPlayed + 1,
      totalValueAppraised:
        records.totalValueAppraised + totalValue,
    };

    setRecords(next);
    saveRecords(next);
  }

  return {
    records,
    recordRun,
  };
}