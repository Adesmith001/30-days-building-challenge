import {
  motion,
} from "motion/react";

import {
  MAX_ATTEMPTS,
} from "../data/words";

import type {
  EvaluatedLetter,
} from "../types/game";

const tileStyles = {
  correct:
    "border-[#174c3b] bg-[#174c3b] text-white",

  present:
    "border-[#b56820] bg-[#b56820] text-white",

  absent:
    "border-[#8f938f] bg-[#8f938f] text-white",

  empty:
    "border-[#cfc8be] bg-transparent text-[#161412]",
};

type Props = {
  wordLength: number;
  rows: EvaluatedLetter[][];
  currentGuess: string;
  gameOver: boolean;
};

export function WordGrid({
  wordLength,
  rows,
  currentGuess,
  gameOver,
}: Props) {
  return (
    <div
      className="
        mx-auto flex
        w-full max-w-[560px]
        flex-col
        gap-1.5 sm:gap-2
      "
    >
      {Array.from(
        {
          length:
            MAX_ATTEMPTS,
        },
        (_, rowIndex) => {
          const submitted =
            rows[rowIndex];

          const isCurrent =
            rowIndex ===
              rows.length &&
            !gameOver;

          return (
            <div
              key={rowIndex}
              className="
                grid
                gap-1.5 sm:gap-2
              "
              style={{
                gridTemplateColumns:
                  `repeat(${wordLength}, minmax(0, 1fr))`,
              }}
            >
              {Array.from(
                {
                  length:
                    wordLength,
                },
                (
                  _,
                  columnIndex,
                ) => {
                  const evaluated =
                    submitted?.[
                      columnIndex
                    ];

                  const letter =
                    evaluated?.letter ??
                    (
                      isCurrent
                        ? currentGuess[
                            columnIndex
                          ] ?? ""
                        : ""
                    );

                  const status =
                    evaluated?.status ??
                    "empty";

                  return (
                    <motion.div
                      key={
                        `${rowIndex}-` +
                        `${columnIndex}-` +
                        `${status}`
                      }
                      initial={
                        evaluated
                          ? {
                              rotateX:
                                90,
                            }
                          : false
                      }
                      animate={{
                        rotateX: 0,
                      }}
                      transition={{
                        delay:
                          evaluated
                            ? columnIndex *
                              0.08
                            : 0,
                        duration:
                          0.28,
                      }}
                      className={`
                        grid
                        aspect-square
                        min-h-9
                        place-items-center
                        border
                        text-base
                        font-semibold
                        uppercase
                        sm:text-xl
                        ${tileStyles[status]}
                      `}
                    >
                      {letter}
                    </motion.div>
                  );
                },
              )}
            </div>
          );
        },
      )}
    </div>
  );
}