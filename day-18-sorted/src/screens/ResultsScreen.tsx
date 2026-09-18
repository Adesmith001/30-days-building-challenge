import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AppShell,
} from "../components/AppShell";

import {
  PrimaryButton,
} from "../components/PrimaryButton";

import {
  puzzleMap,
} from "../data/puzzles";

import {
  formatTime,
  getRank,
} from "../lib/scoring";

import {
  shareRun,
} from "../lib/share";

import {
  loadRecords,
  saveRecords,
  saveRun,
} from "../lib/storage";

import type {
  GameSession,
  RunRecord,
} from "../types/game";

export function ResultsScreen({
  session,
  onAgain,
  onHome,
  onHistory,
}: {
  session: GameSession;
  onAgain: () => void;
  onHome: () => void;
  onHistory: () => void;
}) {
  const cardRef =
    useRef<HTMLDivElement>(
      null,
    );

  const [
    shareStatus,
    setShareStatus,
  ] =
    useState("");

  const [
    previousBest,
  ] =
    useState(
      () =>
        loadRecords()
          .personalBest,
    );

  const record =
    useMemo<
      RunRecord
    >(
      () => {
        const exactPositions =
          session.results
            .reduce(
              (
                sum,
                result,
              ) =>
                sum +
                result
                  .exactPositions,
              0,
            );

        const perfectOrders =
          session.results
            .filter(
              (result) =>
                result.perfect,
            ).length;

        const perfectTimes =
          session.results
            .filter(
              (result) =>
                result.perfect,
            )
            .map(
              (result) =>
                result
                  .durationMs,
            );

        const maxScore =
          session
            .puzzleIds
            .length *
          1000;

        const normalized =
          maxScore
            ? Math.round(
                (
                  session.score /
                  maxScore
                ) *
                  10000,
              )
            : 0;

        return {
          id: session.id,
          date:
            new Date()
              .toISOString(),
          mode:
            session.mode,
          category:
            session.category,
          score:
            session.score,
          maxScore,
          exactPositions,
          perfectOrders,
          fastestPerfectMs:
            perfectTimes
              .length
              ? Math.min(
                  ...perfectTimes,
                )
              : undefined,
          hintsUsed:
            session.results
              .filter(
                (result) =>
                  result
                    .hintUsed,
              ).length,
          rank:
            session.mode ===
            "daily"
              ? "DAILY SORT"
              : getRank(
                  normalized,
                ),
        };
      },
      [session],
    );

  useEffect(
    () => {
      const isNew =
        saveRun(
          record,
        );

      if (!isNew) {
        return;
      }

      const current =
        loadRecords();

      const shouldTrackBest =
        session.mode !==
        "daily";

      const next = {
        ...current,

        personalBest:
          shouldTrackBest
            ? Math.max(
                current
                  .personalBest,
                record.score,
              )
            : current
                .personalBest,

        fastestPerfectMs:
          record
            .fastestPerfectMs
            ? Math.min(
                current
                  .fastestPerfectMs ??
                  Infinity,
                record
                  .fastestPerfectMs,
              )
            : current
                .fastestPerfectMs,

        mostPerfectRounds:
          Math.max(
            current
              .mostPerfectRounds,
            record
              .perfectOrders,
          ),

        runsPlayed:
          current
            .runsPlayed +
          1,

        completedPuzzleIds:
          Array.from(
            new Set([
              ...current
                .completedPuzzleIds,
              ...session
                .puzzleIds,
            ]),
          ),

        dailyResults:
          session.mode ===
          "daily"
            ? {
                ...current
                  .dailyResults,
                [
                  session.seed
                ]: record,
              }
            : current
                .dailyResults,
      };

      saveRecords(
        next,
      );
    },
    [
      record,
      session,
    ],
  );

  const best =
    [
      ...session.results,
    ].sort(
      (a, b) =>
        b.points -
          a.points ||
        a.durationMs -
          b.durationMs,
    )[0];

  const worst =
    [
      ...session.results,
    ].sort(
      (a, b) =>
        a.exactPositions -
          b.exactPositions ||
        b.durationMs -
          a.durationMs,
    )[0];

  const bestPuzzle =
    best
      ? puzzleMap.get(
          best.puzzleId,
        )
      : undefined;

  const worstPuzzle =
    worst
      ? puzzleMap.get(
          worst.puzzleId,
        )
      : undefined;

  const newBest =
    session.mode !==
      "daily" &&
    record.score >
      previousBest;

  const handleShare =
    async () => {
      if (
        !cardRef.current
      ) {
        return;
      }

      try {
        const result =
          await shareRun(
            cardRef.current,
            record,
          );

        setShareStatus(
          result ===
            "shared"
            ? "SHARED"
            : "IMAGE SAVED · COPY READY",
        );
      } catch {
        setShareStatus(
          "SHARE FAILED — TRY AGAIN",
        );
      }
    };

  return (
    <AppShell
      hideNav
      onNavigate={() =>
        onHome()
      }
    >
      <div
        className="
          space-y-5
          pb-6
        "
      >
        <section
          className="
            text-center
          "
        >
          <span
            className="
              font-display
              text-xs
              font-bold
              tracking-[0.2em]
              text-emerald-300
            "
          >
            {session.mode ===
            "daily"
              ? "DAILY SORT COMPLETE"
              : "RUN COMPLETE"}
          </span>

          <h1
            className="
              mt-2
              font-display
              text-4xl
              font-bold
            "
          >
            YOU'RE SORTED.
          </h1>

          <div
            className="
              mt-3
              font-display
              text-6xl
              font-bold
              text-gold
            "
          >
            {
              record.score
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
            {record.rank}
          </p>

          {newBest && (
            <p
              className="
                mt-2
                font-display
                text-xs
                font-bold
                text-emerald-300
              "
            >
              NEW BEST ·
              PREVIOUS
              {" "}
              {
                previousBest
                  .toLocaleString()
              }
            </p>
          )}
        </section>

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-4
          "
        >
          {[
            [
              record
                .exactPositions,
              "EXACT POSITIONS",
            ],
            [
              record
                .perfectOrders,
              "PERFECT ORDERS",
            ],
            [
              formatTime(
                record
                  .fastestPerfectMs,
              ),
              "FASTEST PERFECT",
            ],
            [
              record.hintsUsed,
              "HINTS USED",
            ],
          ].map(
            ([
              value,
              label,
            ]) => (
              <div
                key={label}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-3
                  text-center
                "
              >
                <strong
                  className="
                    block
                    font-display
                    text-xl
                    text-white
                  "
                >
                  {value}
                </strong>

                <span
                  className="
                    text-[9px]
                    font-bold
                    tracking-wide
                    text-slate-500
                  "
                >
                  {label}
                </span>
              </div>
            ),
          )}
        </div>

        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          {best &&
            bestPuzzle && (
              <div
                className="
                  rounded-2xl
                  border
                  border-emerald-400/20
                  bg-emerald-400/10
                  p-4
                "
              >
                <span
                  className="
                    font-display
                    text-[10px]
                    font-bold
                    tracking-widest
                    text-emerald-300
                  "
                >
                  CLEANEST SORT.
                </span>

                <h2
                  className="
                    mt-2
                    font-display
                    text-lg
                    font-bold
                  "
                >
                  {
                    bestPuzzle
                      .prompt
                  }
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-300
                  "
                >
                  {
                    best
                      .exactPositions
                  }
                  {" / 4 · "}
                  {
                    formatTime(
                      best
                        .durationMs,
                    )
                  }
                </p>
              </div>
            )}

          {worst &&
            worstPuzzle && (
              <div
                className="
                  rounded-2xl
                  border
                  border-amber-400/20
                  bg-amber-400/10
                  p-4
                "
              >
                <span
                  className="
                    font-display
                    text-[10px]
                    font-bold
                    tracking-widest
                    text-amber-300
                  "
                >
                  THIS ONE
                  SCATTERED YOU.
                </span>

                <h2
                  className="
                    mt-2
                    font-display
                    text-lg
                    font-bold
                  "
                >
                  {
                    worstPuzzle
                      .prompt
                  }
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-300
                  "
                >
                  {
                    worst
                      .exactPositions
                  }
                  {" / 4 EXACT"}
                </p>
              </div>
            )}
        </div>

        <div
          ref={
            cardRef
          }
          className="
            aspect-square
            rounded-[2rem]
            bg-[#101936]
            p-8
            shadow-2xl
          "
        >
          <div
            className="
              flex
              h-full
              flex-col
              justify-between
              border
              border-white/10
              p-6
            "
          >
            <div>
              <span
                className="
                  font-display
                  text-xl
                  font-bold
                  text-gold
                "
              >
                SORTED.
              </span>

              <p
                className="
                  mt-1
                  font-display
                  text-xs
                  font-bold
                  text-slate-400
                "
              >
                DAY 18 / 30
              </p>
            </div>

            <div>
              <div
                className="
                  font-display
                  text-6xl
                  font-bold
                "
              >
                {
                  record
                    .score
                    .toLocaleString()
                }
              </div>

              <p
                className="
                  mt-3
                  text-sm
                  text-slate-300
                "
              >
                {
                  record
                    .perfectOrders
                }
                {" PERFECT · "}
                {
                  record
                    .exactPositions
                }
                {" EXACT"}
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-300
                "
              >
                FASTEST PERFECT ·
                {" "}
                {
                  formatTime(
                    record
                      .fastestPerfectMs,
                  )
                }
              </p>
            </div>

            <p
              className="
                font-display
                text-lg
                font-bold
                text-gold
              "
            >
              4 THINGS.
              1 ORDER.
            </p>
          </div>
        </div>

        <div
          className="
            space-y-3
          "
        >
          <PrimaryButton
            onClick={
              handleShare
            }
          >
            SHARE →
          </PrimaryButton>

          {shareStatus && (
            <p
              className="
                text-center
                text-xs
                font-bold
                text-slate-400
              "
            >
              {shareStatus}
            </p>
          )}

          <PrimaryButton
            subtle
            onClick={
              onAgain
            }
          >
            PLAY AGAIN
          </PrimaryButton>

          <button
            onClick={
              onHistory
            }
            className="
              w-full
              py-2
              text-xs
              font-bold
              text-slate-400
              hover:text-white
            "
          >
            VIEW RUN HISTORY
          </button>

          <button
            onClick={
              onHome
            }
            className="
              w-full
              py-2
              text-xs
              font-bold
              text-slate-500
              hover:text-white
            "
          >
            BACK HOME
          </button>
        </div>
      </div>
    </AppShell>
  );
}