/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/refs */
import { useCallback, useRef, useState } from "react";
import { levels } from "../data/levels";
import { scoreCatch } from "../lib/scoring";
import type {
  CatchOutcome,
  CatchSummary,
  GamePhase,
  RunStats,
} from "../types/game";

export function useGameSession() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [bestStreak, setBestStreak] = useState(1);
  const [totalMisses, setTotalMisses] = useState(0);
  const [levelMisses, setLevelMisses] = useState(0);
  const [cleanCatches, setCleanCatches] = useState(0);
  const [fastestCatch, setFastestCatch] =
    useState<number | null>(null);
  const [bossHits, setBossHits] = useState(0);
  const [lastCatch, setLastCatch] =
    useState<CatchSummary | null>(null);

  const startedAt = useRef(0);
  const levelStartedAt = useRef(0);
  const endedAt = useRef(0);
  const transitionTimer = useRef(0);

  const level = levels[levelIndex];

  const clearTransition = () => {
    window.clearTimeout(transitionTimer.current);
  };

  const startGame = useCallback(() => {
    clearTransition();
    startedAt.current = performance.now();
    endedAt.current = 0;
    setLevelIndex(0);
    setScore(0);
    setStreak(1);
    setBestStreak(1);
    setTotalMisses(0);
    setLevelMisses(0);
    setCleanCatches(0);
    setFastestCatch(null);
    setBossHits(0);
    setLastCatch(null);
    setPhase("level-intro");
  }, []);

  const beginLevel = useCallback(() => {
    levelStartedAt.current = performance.now();
    setLevelMisses(0);
    setPhase("playing");
  }, []);

  const registerMiss = useCallback(() => {
    setTotalMisses((value) => value + 1);

    setLevelMisses((value) => {
      const next = value + 1;

      if (next >= 2) {
        setStreak(1);
      }

      return next;
    });
  }, []);

  const catchButton = useCallback((): CatchOutcome => {
    if (level.id === 10 && bossHits < 2) {
      const points = 300 + bossHits * 100;

      setBossHits((value) => value + 1);
      setScore((value) => value + points);

      return {
        completed: false,
        points,
        label: `RESOLVE ${bossHits + 1}/3`,
      };
    }

    const elapsedMs =
      performance.now() - levelStartedAt.current;

    const nextStreak =
      levelMisses === 0
        ? Math.min(6, streak + 1)
        : levelMisses >= 2
          ? 1
          : streak;

    const summary = scoreCatch(
      level,
      elapsedMs,
      levelMisses,
      nextStreak,
    );

    setScore((value) => value + summary.points);
    setStreak(nextStreak);
    setBestStreak((value) =>
      Math.max(value, nextStreak),
    );

    if (summary.clean) {
      setCleanCatches((value) => value + 1);
    }

    setFastestCatch((value) =>
      value === null
        ? elapsedMs
        : Math.min(value, elapsedMs),
    );

    setLastCatch(summary);

    transitionTimer.current = window.setTimeout(() => {
      setPhase(
        level.id === 10
          ? "boss-ending"
          : "level-complete",
      );
    }, 280);

    return {
      completed: true,
      points: summary.points,
      label: summary.label,
    };
  }, [
    bossHits,
    level,
    levelMisses,
    streak,
  ]);

  const advanceLevel = useCallback(() => {
    setLevelIndex((value) =>
      Math.min(value + 1, levels.length - 1),
    );
    setBossHits(0);
    setPhase("level-intro");
  }, []);

  const showResults = useCallback(() => {
    endedAt.current = performance.now();
    setPhase("results");
  }, []);

  const reset = useCallback(() => {
    clearTransition();
    setPhase("intro");
  }, []);

  const stats: RunStats = {
    score,
    levelsCleared:
      phase === "results" || phase === "boss-ending"
        ? 10
        : levelIndex,
    totalTimeMs: startedAt.current
      ? (endedAt.current || performance.now()) -
        startedAt.current
      : 0,
    misses: totalMisses,
    cleanCatches,
    bestStreak,
    fastestCatchMs: fastestCatch,
  };

  return {
    phase,
    level,
    levelIndex,
    score,
    streak,
    bossHits,
    lastCatch,
    stats,
    startGame,
    beginLevel,
    registerMiss,
    catchButton,
    advanceLevel,
    showResults,
    reset,
  };
}