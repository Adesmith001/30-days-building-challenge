/* eslint-disable react-hooks/purity */
import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
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

import type {
  RoundResult,
  SortPuzzle,
} from "../types/game";

import {
  PrimaryButton,
} from "./PrimaryButton";

import {
  RevealBoard,
} from "./RevealBoard";

import {
  ScoreMoment,
} from "./ScoreMoment";

export function BlindRound({
  puzzle,
  seed,
  onDone,
}: {
  puzzle: SortPuzzle;
  seed: string;
  onDone: (
    result: RoundResult,
  ) => void;
}) {
  const sequence =
    useMemo(
      () =>
        getPresentedItems(
          puzzle,
          `${seed}:blind`,
        ),
      [
        puzzle,
        seed,
      ],
    );

  const correctIds =
    useMemo(
      () =>
        getCorrectIds(
          puzzle,
        ),
      [puzzle],
    );

  const correctItems =
    useMemo(
      () =>
        getCorrectItems(
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
    itemIndex,
    setItemIndex,
  ] =
    useState(0);

  const [
    result,
    setResult,
  ] =
    useState<
      RoundResult | null
    >(null);

  const start =
    useRef(
      performance.now(),
    );

  const current =
    sequence[
      itemIndex
    ];

  const place = (
    slotIndex: number,
  ) => {
    if (
      !current ||
      slots[
        slotIndex
      ] ||
      result
    ) {
      return;
    }

    setSlots(
      (values) =>
        values.map(
          (
            value,
            index,
          ) =>
            index ===
            slotIndex
              ? current.id
              : value,
        ),
    );

    setItemIndex(
      (value) =>
        value + 1,
    );
  };

  const reveal = () => {
    if (
      slots.some(
        (slot) => !slot,
      ) ||
      result
    ) {
      return;
    }

    setResult(
      scoreRound(
        puzzle.id,
        slots as string[],
        correctIds,
        performance.now() -
          start.current,
        false,
      ),
    );
  };

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
            font-display
            text-[10px]
            font-bold
            tracking-widest
            text-emerald-300
          "
        >
          BLIND SORT ·
          {" "}
          {puzzle.category}
        </span>

        <h2
          className="
            mt-2
            font-display
            text-2xl
            font-bold
            text-gold
          "
        >
          {puzzle.prompt}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-400
          "
        >
          Place each item.
          Once it lands,
          it cannot move.
        </p>
      </section>

      {!result &&
        current && (
          <motion.div
            key={
              current.id
            }
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              tactile-tile
              relative
              mx-auto
              aspect-[1.5]
              w-full
              max-w-sm
              overflow-hidden
              rounded-2xl
              bg-white
              text-ink
            "
          >
            {current.image && (
              <>
                <img
                  src={
                    current.image
                  }
                  alt=""
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/90
                    via-black/20
                    to-transparent
                  "
                />
              </>
            )}

            <div
              className={`
                absolute
                inset-0
                flex
                items-end
                p-5
                ${
                  current.image
                    ? "text-white"
                    : "text-ink"
                }
              `}
            >
              <div>
                <span
                  className="
                    font-display
                    text-[10px]
                    font-bold
                    opacity-60
                  "
                >
                  ITEM
                  {" "}
                  {itemIndex + 1}
                  {" "}
                  OF 4
                </span>

                <h3
                  className="
                    mt-1
                    font-display
                    text-3xl
                    font-bold
                  "
                >
                  {
                    current.label
                  }
                </h3>
              </div>
            </div>
          </motion.div>
        )}

      {!result &&
        !current && (
          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-5
              text-center
            "
          >
            <span
              className="
                font-display
                font-bold
              "
            >
              ALL FOUR PLACED.
            </span>

            <p
              className="
                mt-1
                text-sm
                text-slate-400
              "
            >
              No edits now.
              Reveal the sort.
            </p>
          </div>
        )}

      {!result && (
        <div
          className="
            grid
            grid-cols-4
            gap-2
          "
        >
          {slots.map(
            (
              id,
              index,
            ) => {
              const item =
                sequence.find(
                  (entry) =>
                    entry.id ===
                    id,
                );

              return (
                <button
                  key={index}
                  onClick={() =>
                    place(
                      index,
                    )
                  }
                  disabled={
                    Boolean(
                      id,
                    ) ||
                    !current
                  }
                  className="
                    recessed
                    min-h-24
                    rounded-xl
                    border
                    border-white/10
                    bg-well
                    p-2
                    disabled:cursor-default
                  "
                >
                  {item ? (
                    <span
                      className="
                        block
                        rounded-lg
                        bg-white
                        p-2
                        font-display
                        text-[10px]
                        font-bold
                        leading-tight
                        text-ink
                      "
                    >
                      {item.label}
                    </span>
                  ) : (
                    <span
                      className="
                        font-display
                        text-xl
                        font-bold
                        text-slate-700
                      "
                    >
                      {index + 1}
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>
      )}

      {!result && (
        <PrimaryButton
          disabled={
            Boolean(
              current,
            )
          }
          onClick={
            reveal
          }
        >
          REVEAL ORDER →
        </PrimaryButton>
      )}

      {result && (
        <div
          className="
            space-y-4
          "
        >
          <ScoreMoment
            result={result}
          />

          <RevealBoard
            items={
              correctItems
            }
            originalOrder={
              result.playerOrder
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
              text-slate-300
            "
          >
            {puzzle.fact}
          </p>

          <PrimaryButton
            onClick={() =>
              onDone(
                result,
              )
            }
          >
            NEXT →
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}