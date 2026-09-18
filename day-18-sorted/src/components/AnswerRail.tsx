import {
  motion,
} from "motion/react";

import type {
  SortItem,
} from "../types/game";

interface Props {
  slots:
    Array<string | null>;
  items: SortItem[];
  lockedSlots?:
    Set<number>;
  disabled?: boolean;
  onRemove?: (
    index: number,
  ) => void;
  onMove?: (
    index: number,
    direction: -1 | 1,
  ) => void;
}

export function AnswerRail({
  slots,
  items,
  lockedSlots =
    new Set(),
  disabled,
  onRemove,
  onMove,
}: Props) {
  const itemMap =
    new Map(
      items.map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  return (
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
            id
              ? itemMap.get(
                  id,
                )
              : undefined;

          const locked =
            lockedSlots.has(
              index,
            );

          return (
            <motion.div
              layout
              key={index}
              className={`
                recessed
                min-h-20
                rounded-xl
                border
                p-1.5
                ${
                  item
                    ? `
                      border-white/15
                      bg-[#101936]
                    `
                    : `
                      border-white/5
                      bg-well
                    `
                }
              `}
            >
              {!item ? (
                <div
                  className="
                    flex
                    h-full
                    min-h-16
                    items-center
                    justify-center
                    font-display
                    text-xl
                    font-bold
                    text-slate-700
                  "
                >
                  {index + 1}
                </div>
              ) : (
                <motion.div
                  layoutId={
                    `answer-${
                      item.id
                    }`
                  }
                  className="
                    flex
                    h-full
                    min-h-16
                    flex-col
                    justify-between
                    rounded-lg
                    bg-white
                    p-2
                    text-ink
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-1
                    "
                  >
                    <span
                      className="
                        font-display
                        text-[9px]
                        font-bold
                        text-slate-400
                      "
                    >
                      {index + 1}
                    </span>

                    {locked && (
                      <span
                        className="
                          rounded
                          bg-emerald-100
                          px-1
                          text-[8px]
                          font-bold
                          text-emerald-700
                        "
                      >
                        PLACED
                      </span>
                    )}
                  </div>

                  <button
                    disabled={
                      disabled ||
                      locked
                    }
                    onClick={() =>
                      onRemove?.(
                        index,
                      )
                    }
                    className="
                      text-left
                      font-display
                      text-[10px]
                      font-bold
                      leading-tight
                      sm:text-xs
                    "
                    aria-label={
                      `Remove ${
                        item.label
                      } from position ${
                        index + 1
                      }`
                    }
                  >
                    {item.label}
                  </button>

                  {!disabled &&
                    !locked &&
                    onMove && (
                      <div
                        className="
                          mt-1
                          flex
                          gap-1
                        "
                      >
                        <button
                          onClick={() =>
                            onMove(
                              index,
                              -1,
                            )
                          }
                          disabled={
                            index ===
                            0
                          }
                          className="
                            flex-1
                            rounded
                            bg-slate-100
                            py-0.5
                            text-[8px]
                            font-bold
                            disabled:opacity-30
                          "
                        >
                          LEFT
                        </button>

                        <button
                          onClick={() =>
                            onMove(
                              index,
                              1,
                            )
                          }
                          disabled={
                            index ===
                            3
                          }
                          className="
                            flex-1
                            rounded
                            bg-slate-100
                            py-0.5
                            text-[8px]
                            font-bold
                            disabled:opacity-30
                          "
                        >
                          RIGHT
                        </button>
                      </div>
                    )}
                </motion.div>
              )}
            </motion.div>
          );
        },
      )}
    </div>
  );
}