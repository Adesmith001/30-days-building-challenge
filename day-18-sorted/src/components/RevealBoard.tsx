import {
  motion,
} from "motion/react";

import type {
  SortItem,
} from "../types/game";

export function RevealBoard({
  items,
  originalOrder,
}: {
  items: SortItem[];
  originalOrder:
    string[];
}) {
  return (
    <div
      className="
        space-y-2
      "
    >
      {items.map(
        (
          item,
          index,
        ) => {
          const exact =
            originalOrder[
              index
            ] === item.id;

          return (
            <motion.div
              layout
              key={item.id}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay:
                  index *
                  0.06,
              }}
              className={`
                flex
                items-center
                gap-3
                rounded-xl
                border
                bg-white
                p-3
                text-ink
                ${
                  exact
                    ? `
                      border-emerald-400
                    `
                    : `
                      border-amber-300
                    `
                }
              `}
            >
              {item.image && (
                <img
                  src={
                    item.image
                  }
                  alt=""
                  className="
                    h-12
                    w-12
                    rounded-lg
                    object-cover
                  "
                />
              )}

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <span
                    className="
                      font-display
                      text-sm
                      font-bold
                    "
                  >
                    {index + 1}.
                    {" "}
                    {item.label}
                  </span>

                  <span
                    className={`
                      text-[10px]
                      font-bold
                      ${
                        exact
                          ? `
                            text-emerald-700
                          `
                          : `
                            text-amber-700
                          `
                      }
                    `}
                  >
                    {exact
                      ? "EXACT"
                      : "MOVED"}
                  </span>
                </div>

                <span
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  {
                    item.displayValue
                  }
                </span>
              </div>
            </motion.div>
          );
        },
      )}
    </div>
  );
}