import {
  forwardRef,
} from "react";

import {
  formatNairaCompact,
} from "../lib/currency";

import type {
  ComparisonDraft,
  ComparisonMetrics,
} from "../types/comparison";

interface Props {
  draft: ComparisonDraft;
  metrics: ComparisonMetrics;
}

const ShareCard =
  forwardRef<
    HTMLDivElement,
    Props
  >(
    (
      {
        draft,
        metrics,
      },
      ref,
    ) => {
      return (
        <div
          ref={ref}
          className="
            aspect-square
            w-full
            max-w-[560px]
            border
            border-ink
            bg-paper
            p-8
            text-ink
          "
        >
          <div
            className="
              flex
              h-full
              flex-col
              justify-between
            "
          >
            <div
              className="
                flex
                justify-between
                border-b
                border-line
                pb-4
                font-mono
                text-[10px]
                text-muted
              "
            >
              <span>
                FARTHER AWAY?
              </span>

              <span>
                DAY 16 / 30
              </span>
            </div>

            <div>
              <p
                className="
                  font-serif
                  text-4xl
                  uppercase
                  leading-none
                "
              >
                {draft.homeA.name ||
                  "HOME A"}
              </p>

              <p
                className="
                  my-3
                  font-mono
                  text-xs
                  text-muted
                "
              >
                VS
              </p>

              <p
                className="
                  font-serif
                  text-4xl
                  uppercase
                  leading-none
                "
              >
                {draft.homeB.name ||
                  "HOME B"}
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-2
                border-y
                border-line
              "
            >
              <div
                className="
                  py-5
                  pr-4
                "
              >
                <p
                  className="
                    text-[10px]
                    font-semibold
                    tracking-[0.1em]
                    text-muted
                  "
                >
                  CASH DIFFERENCE
                </p>

                <p
                  className="
                    mt-2
                    font-mono
                    text-2xl
                    text-savings
                  "
                >
                  {formatNairaCompact(
                    Math.abs(
                      metrics.cashSavingsB,
                    ),
                  )}
                </p>

                <p
                  className="
                    font-mono
                    text-[9px]
                    text-muted
                  "
                >
                  / YEAR
                </p>
              </div>

              <div
                className="
                  border-l
                  border-line
                  py-5
                  pl-4
                "
              >
                <p
                  className="
                    text-[10px]
                    font-semibold
                    tracking-[0.1em]
                    text-muted
                  "
                >
                  TIME DIFFERENCE
                </p>

                <p
                  className="
                    mt-2
                    font-mono
                    text-2xl
                    text-time
                  "
                >
                  {Math.abs(
                    Math.round(
                      metrics.extraHoursB,
                    ),
                  )}
                  H
                </p>

                <p
                  className="
                    font-mono
                    text-[9px]
                    text-muted
                  "
                >
                  / YEAR
                </p>
              </div>
            </div>

            <div>
              <p
                className="
                  font-serif
                  text-2xl
                "
              >
                WHAT ARE YOU
                ACTUALLY TRADING?
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  text-muted
                "
              >
                Rent · transport ·
                commute time ·
                break-even
              </p>
            </div>
          </div>
        </div>
      );
    },
  );

ShareCard.displayName =
  "ShareCard";

export default ShareCard;