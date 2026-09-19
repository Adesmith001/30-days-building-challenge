/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  getCorrectIds,
  getCorrectItems,
  getPresentedItems,
} from "../lib/ordering";

import {
  scoreRound,
} from "../lib/scoring";

import {
  pickSeeded,
} from "../lib/seed";

import type {
  RoundResult,
  SortPuzzle,
} from "../types/game";

import {
  AnswerRail,
} from "./AnswerRail";

import {
  PrimaryButton,
} from "./PrimaryButton";

import {
  RevealBoard,
} from "./RevealBoard";

import {
  ScoreMoment,
} from "./ScoreMoment";

import {
  TileGrid,
} from "./TileGrid";

interface Props {
  puzzle: SortPuzzle;
  seed: string;
  onResolved: (
    result: RoundResult,
  ) => void;
  onNext: () => void;
}

export function RoundBoard({
  puzzle,
  seed,
  onResolved,
  onNext,
}: Props) {
  const presented =
    useMemo(
      () =>
        getPresentedItems(
          puzzle,
          seed,
        ),
      [
        puzzle,
        seed,
      ],
    );

  const correctItems =
    useMemo(
      () =>
        getCorrectItems(
          puzzle,
        ),
      [puzzle],
    );

  const correctIds =
    useMemo(
      () =>
        getCorrectIds(
          puzzle,
        ),
      [puzzle],
    );

  const [
    slots,
    setSlots,
  ] =
    useState<
      Array<
        string | null
      >
    >([
      null,
      null,
      null,
      null,
    ]);

  const [
    lockedSlots,
    setLockedSlots,
  ] =
    useState<
      Set<number>
    >(
      new Set(),
    );

  const [
    phase,
    setPhase,
  ] =
    useState<
      | "playing"
      | "revealing"
      | "result"
    >("playing");

  const [
    hintUsed,
    setHintUsed,
  ] =
    useState(false);

  const [
    result,
    setResult,
  ] =
    useState<
      RoundResult | null
    >(null);

  const startedAt =
    useRef(
      performance.now(),
    );

  const select =
    useCallback(
      (
        id: string,
      ) => {
        if (
          phase !==
            "playing" ||
          slots.includes(id)
        ) {
          return;
        }

        const open =
          slots.findIndex(
            (slot) =>
              slot === null,
          );

        if (open < 0) {
          return;
        }

        setSlots(
          (current) =>
            current.map(
              (
                slot,
                index,
              ) =>
                index === open
                  ? id
                  : slot,
            ),
        );
      },
      [
        phase,
        slots,
      ],
    );

  const remove = (
    index: number,
  ) => {
    if (
      phase !==
        "playing" ||
      lockedSlots.has(
        index,
      )
    ) {
      return;
    }

    setSlots(
      (current) =>
        current.map(
          (
            slot,
            i,
          ) =>
            i === index
              ? null
              : slot,
        ),
    );
  };

  const move = (
    index: number,
    direction: -1 | 1,
  ) => {
    const target =
      index + direction;

    if (
      target < 0 ||
      target > 3 ||
      lockedSlots.has(
        index,
      ) ||
      lockedSlots.has(
        target,
      )
    ) {
      return;
    }

    setSlots(
      (current) => {
        const next = [
          ...current,
        ];

        [
          next[index],
          next[target],
        ] = [
          next[target],
          next[index],
        ];

        return next;
      },
    );
  };

  const useHint = () => {
    if (
      hintUsed ||
      phase !==
        "playing"
    ) {
      return;
    }

    const choices =
      correctIds.filter(
        (
          _,
          index,
        ) =>
          !lockedSlots.has(
            index,
          ),
      );

    const id =
      pickSeeded(
        choices,
        `${seed}:${
          puzzle.id
        }:hint`,
      );

    const target =
      correctIds.indexOf(
        id,
      );

    setSlots(
      (current) => {
        const next =
          current.map(
            (slot) =>
              slot === id
                ? null
                : slot,
          );

        next[target] =
          id;

        return next;
      },
    );

    setLockedSlots(
      (current) =>
        new Set([
          ...current,
          target,
        ]),
    );

    setHintUsed(true);
  };

  const lock =
    useCallback(
      () => {
        if (
          phase !==
            "playing" ||
          slots.some(
            (slot) =>
              !slot,
          )
        ) {
          return;
        }

        const player =
          slots as string[];

        const nextResult =
          scoreRound(
            puzzle.id,
            player,
            correctIds,
            performance.now() -
              startedAt.current,
            hintUsed,
          );

        setResult(
          nextResult,
        );

        setPhase(
          "revealing",
        );

        setSlots(
          correctIds,
        );

        window.setTimeout(
          () => {
            setPhase(
              "result",
            );

            onResolved(
              nextResult,
            );
          },
          650,
        );
      },
      [
        correctIds,
        hintUsed,
        onResolved,
        phase,
        puzzle.id,
        slots,
      ],
    );

  useEffect(
    () => {
      const onKey = (
        event:
          KeyboardEvent,
      ) => {
        if (
          phase !==
          "playing"
        ) {
          return;
        }

        const number =
          Number(
            event.key,
          );

        if (
          number >= 1 &&
          number <= 4
        ) {
          select(
            presented[
              number - 1
            ].id,
          );
        }

        if (
          event.key ===
          "Enter"
        ) {
          lock();
        }

        if (
          event.key ===
          "Backspace"
        ) {
          const index =
            slots
              .findLastIndex(
                (
                  slot,
                  i,
                ) =>
                  Boolean(
                    slot,
                  ) &&
                  !lockedSlots
                    .has(i),
              );

          if (
            index >= 0
          ) {
            remove(
              index,
            );
          }
        }
      };

      window
        .addEventListener(
          "keydown",
          onKey,
        );

      return () =>
        window
          .removeEventListener(
            "keydown",
            onKey,
          );
    },
    [
      lock,
      lockedSlots,
      phase,
      presented,
      select,
      slots,
    ],
  );

  const complete =
    slots.every(
      Boolean,
    );

  return (
    <div
      className="
        space-y-4
      "
    >
      <section
        className="
          text-center
        "
      >
        <span
          className="
            inline-flex
            rounded-full
            border
            border-white/10
            bg-white/5
            px-3
            py-1
            font-display
            text-[10px]
            font-bold
            tracking-widest
            text-emerald-300
          "
        >
          {
            puzzle.category
          }
        </span>

        <h2
          className="
            mt-2
            font-display
            text-2xl
            font-bold
            tracking-tight
            text-gold
            sm:text-3xl
          "
        >
          {puzzle.prompt}
        </h2>

        <p
          className="
            mx-auto
            mt-1
            max-w-sm
            text-sm
            text-slate-400
          "
        >
          {
            puzzle.description
          }
        </p>
      </section>

      <AnimatePresence
        mode="wait"
      >
        {phase !==
        "result" ? (
          <motion.div
            key="play"
            exit={{
              opacity: 0,
            }}
            className="
              space-y-4
            "
          >
            <TileGrid
              items={
                presented
              }
              slots={slots}
              disabled={
                phase !==
                "playing"
              }
              onSelect={
                select
              }
            />

            <div>
              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    font-display
                    text-[10px]
                    font-bold
                    tracking-widest
                    text-slate-500
                  "
                >
                  YOUR ORDER
                </span>

                <button
                  onClick={
                    useHint
                  }
                  disabled={
                    hintUsed ||
                    phase !==
                      "playing"
                  }
                  className="
                    font-display
                    text-[10px]
                    font-bold
                    text-amber-300
                    disabled:opacity-30
                  "
                >
                  {hintUsed
                    ? "ONE PLACED · MAX 800"
                    : "PLACE ONE · −200 MAX"}
                </button>
              </div>

              <AnswerRail
                slots={slots}
                items={
                  puzzle.items
                }
                lockedSlots={
                  lockedSlots
                }
                disabled={
                  phase !==
                    "playing"
                }
                onRemove={
                  remove
                }
                onMove={move}
              />
            </div>

            <PrimaryButton
              disabled={
                !complete ||
                phase !==
                  "playing"
              }
              onClick={
                lock
              }
            >
              {phase ===
              "revealing"
                ? "SORTING…"
                : "LOCK ORDER →"}
            </PrimaryButton>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="
              space-y-4
            "
          >
            {result && (
              <ScoreMoment
                result={
                  result
                }
              />
            )}

            <RevealBoard
              items={
                correctItems
              }
              originalOrder={
                result
                  ?.playerOrder ??
                []
              }
            />

            <p
              className="
                rounded-xl
                border
                border-white/10
                bg-white/5
                p-3
                text-sm
                leading-6
                text-slate-300
              "
            >
              <strong
                className="
                  text-white
                "
              >
                Quick fact:
              </strong>
              {" "}
              {puzzle.fact}
            </p>

            <PrimaryButton
              onClick={
                onNext
              }
            >
              NEXT →
            </PrimaryButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}