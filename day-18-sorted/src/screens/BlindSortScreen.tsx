import {
  useMemo,
  useState,
} from "react";

import {
  AppShell,
} from "../components/AppShell";

import {
  BlindRound,
} from "../components/BlindRound";

import {
  PrimaryButton,
} from "../components/PrimaryButton";

import {
  puzzleMap,
} from "../data/puzzles";

import {
  createDeck,
} from "../lib/deck";

import type {
  RoundResult,
} from "../types/game";

export function BlindSortScreen({
  onHome,
}: {
  onHome: () => void;
}) {
  const [seed] =
    useState(
      () =>
        `blind-${Date.now()}`,
    );

  const deck =
    useMemo(
      () =>
        createDeck({
          seed,
          mode: "normal",
          count: 5,
        }),
      [seed],
    );

  const [
    round,
    setRound,
  ] =
    useState(0);

  const [
    results,
    setResults,
  ] =
    useState<
      RoundResult[]
    >([]);

  const done =
    round >=
    deck.length;

  const score =
    results.reduce(
      (
        sum,
        result,
      ) =>
        sum +
        result.points,
      0,
    );

  const finishRound = (
    result:
      RoundResult,
  ) => {
    setResults(
      (current) => [
        ...current,
        result,
      ],
    );

    setRound(
      (current) =>
        current + 1,
    );
  };

  return (
    <AppShell
      hideNav
      onNavigate={() =>
        onHome()
      }
    >
      {!done ? (
        <div
          className="
            space-y-4
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-3
              py-2
              font-display
              text-xs
              font-bold
            "
          >
            <span>
              {round + 1}
              {" / "}
              {deck.length}
            </span>

            <span
              className="
                text-gold
              "
            >
              SCORE
              {" "}
              {
                score
                  .toLocaleString()
              }
            </span>
          </div>

          <BlindRound
            key={
              deck[round]
            }
            puzzle={
              puzzleMap.get(
                deck[round],
              )!
            }
            seed={seed}
            onDone={
              finishRound
            }
          />
        </div>
      ) : (
        <div
          className="
            flex
            flex-1
            flex-col
            justify-center
            text-center
          "
        >
          <span
            className="
              font-display
              text-xs
              font-bold
              tracking-widest
              text-emerald-300
            "
          >
            BLIND SORT COMPLETE
          </span>

          <h1
            className="
              mt-2
              font-display
              text-4xl
              font-bold
            "
          >
            NO TAKEBACKS.
          </h1>

          <div
            className="
              mt-5
              font-display
              text-6xl
              font-bold
              text-gold
            "
          >
            {
              score
                .toLocaleString()
            }
          </div>

          <p
            className="
              mt-2
              text-sm
              text-slate-400
            "
          >
            {
              results.filter(
                (result) =>
                  result.perfect,
              ).length
            }
            {" "}
            perfect ·
            {" "}
            {
              results.reduce(
                (
                  sum,
                  result,
                ) =>
                  sum +
                  result.exactPositions,
                0,
              )
            }
            {" "}
            exact
          </p>

          <div
            className="
              mt-8
              space-y-3
            "
          >
            <PrimaryButton
              onClick={() => {
                setRound(0);
                setResults([]);
              }}
            >
              PLAY BLIND AGAIN
            </PrimaryButton>

            <PrimaryButton
              subtle
              onClick={
                onHome
              }
            >
              BACK HOME
            </PrimaryButton>
          </div>
        </div>
      )}
    </AppShell>
  );
}