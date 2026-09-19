import {
  useCallback,
  useState,
} from "react";

import type {
  GameMode,
  GameSession,
  PuzzleCategory,
  RoundResult,
} from "../types/game";

import {
  createDeck,
  dailySeed,
} from "../lib/deck";

function makeSession(
  mode: GameMode,
  category?: PuzzleCategory,
): GameSession {
  const seed =
    mode === "daily"
      ? dailySeed()
      : `run-${Date.now()}-${
          Math.random()
        }`;

  const count =
    mode === "daily"
      ? 5
      : 10;

  return {
    id: crypto.randomUUID(),
    mode,
    category,
    seed,
    puzzleIds:
      createDeck({
        seed,
        mode,
        count,
        category,
      }),
    roundIndex: 0,
    score: 0,
    results: [],
    startedAt: Date.now(),
  };
}

export function useGameSession() {
  const [
    session,
    setSession,
  ] =
    useState<
      GameSession | null
    >(null);

  const start =
    useCallback(
      (
        mode: GameMode,
        category?:
          PuzzleCategory,
      ) => {
        const next =
          makeSession(
            mode,
            category,
          );

        setSession(next);

        return next;
      },
      [],
    );

  const addResult =
    useCallback(
      (
        result:
          RoundResult,
      ) => {
        setSession(
          (current) => {
            if (!current) {
              return current;
            }

            if (
              current.results
                .some(
                  (item) =>
                    item.puzzleId ===
                    result.puzzleId,
                )
            ) {
              return current;
            }

            return {
              ...current,
              score:
                current.score +
                result.points,
              results: [
                ...current.results,
                result,
              ],
            };
          },
        );
      },
      [],
    );

  const nextRound =
    useCallback(
      () => {
        setSession(
          (current) =>
            current
              ? {
                  ...current,
                  roundIndex:
                    current.roundIndex +
                    1,
                }
              : current,
        );
      },
      [],
    );

  const reset =
    useCallback(
      () =>
        setSession(null),
      [],
    );

  return {
    session,
    start,
    addResult,
    nextRound,
    reset,
  };
}