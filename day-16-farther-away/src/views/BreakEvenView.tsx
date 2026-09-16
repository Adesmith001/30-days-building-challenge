import {
  motion,
} from "motion/react";

import ScenarioSlider from "../components/ScenarioSlider";

import {
  formatNaira,
  formatNairaCompact,
} from "../lib/currency";

import type {
  ComparisonDraft,
  ComparisonMetrics,
} from "../types/comparison";

interface Props {
  draft: ComparisonDraft;
  metrics: ComparisonMetrics;

  onRentChange:
    (value: number) => void;
}

export default function BreakEvenView({
  draft,
  metrics,
  onRentChange,
}: Props) {
  const gap =
    metrics.breakEvenRentB -
    draft.homeB.annualRent;

  const min = Math.max(
    0,
    Math.floor(
      (
        metrics.breakEvenRentB *
        0.45
      ) / 50_000,
    ) * 50_000,
  );

  const max = Math.max(
    min + 500_000,

    Math.ceil(
      (
        metrics.breakEvenRentB *
        1.35
      ) / 50_000,
    ) * 50_000,
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="space-y-8"
    >
      <header>
        <p
          className="
            font-mono
            text-[10px]
            text-muted
          "
        >
          BREAK-EVEN // CASH ONLY
        </p>

        <h1
          className="
            mt-2
            font-serif
            text-5xl
          "
        >
          THE BREAK-EVEN LINE.
        </h1>

        <p
          className="
            mt-3
            max-w-2xl
            text-sm
            leading-6
            text-muted
          "
        >
          How cheap would Home B
          need to be to offset
          the difference in
          transport spending?
        </p>
      </header>

      <div
        className="
          grid
          gap-6
          md:grid-cols-[0.8fr_1.2fr]
        "
      >
        <aside
          className="
            border
            border-line
            bg-paper-soft
            p-6
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-muted
            "
          >
            EXTRA COMMUTE COST
          </p>

          <p
            className="
              mt-2
              font-mono
              text-3xl
            "
          >
            {formatNaira(
              metrics.extraTransportB,
            )}
          </p>

          <div
            className="
              my-6
              border-t
              border-line
            "
          />

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-muted
            "
          >
            HOME A RENT
          </p>

          <p
            className="
              mt-2
              font-mono
              text-xl
            "
          >
            {formatNaira(
              draft.homeA.annualRent,
            )}
          </p>
        </aside>

        <section
          className="
            border
            border-line
            p-6
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-muted
            "
          >
            HOME B MUST BE AT
            OR BELOW
          </p>

          <p
            className="
              mt-3
              font-mono
              text-4xl
              md:text-5xl
            "
          >
            {formatNaira(
              metrics.breakEvenRentB,
            )}
          </p>

          <p
            className="
              mt-2
              text-sm
              text-muted
            "
          >
            per year to be lower
            on rent + commute
            cash alone.
          </p>

          <div
            className="
              mt-8
              grid
              grid-cols-2
              gap-5
              border-t
              border-line
              pt-5
              font-mono
              text-xs
            "
          >
            <div>
              <p
                className="
                  text-muted
                "
              >
                CURRENT HOME B
              </p>

              <p className="mt-1">
                {formatNaira(
                  draft.homeB
                    .annualRent,
                )}
              </p>
            </div>

            <div>
              <p
                className="
                  text-muted
                "
              >
                POSITION
              </p>

              <p
                className={`
                  mt-1
                  ${
                    gap >= 0
                      ? "text-savings"
                      : "text-time"
                  }
                `}
              >
                {formatNairaCompact(
                  Math.abs(gap),
                )}{" "}
                {gap >= 0
                  ? "BELOW"
                  : "ABOVE"}
              </p>
            </div>
          </div>
        </section>
      </div>

      <ScenarioSlider
        label="DRAG HOME B RENT"
        value={
          draft.homeB.annualRent
        }
        min={min}
        max={max}
        step={50_000}
        display={
          formatNaira(
            draft.homeB.annualRent,
          )
        }
        left={
          formatNairaCompact(min)
        }
        right={
          formatNairaCompact(max)
        }
        onChange={onRentChange}
      />

      {metrics.timeBreakEvenHourly && (
        <div
          className="
            border-l-2
            border-cobalt
            pl-5
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.1em]
              text-muted
            "
          >
            OPTIONAL TIME
            BREAK-EVEN
          </p>

          <p
            className="
              mt-2
              font-serif
              text-2xl
            "
          >
            At about{" "}
            <span
              className="
                font-mono
              "
            >
              {formatNaira(
                metrics.timeBreakEvenHourly,
              )}
              /hour
            </span>
            , the current cash
            saving equals the
            added commute time on
            a time-adjusted
            measure.
          </p>
        </div>
      )}
    </motion.div>
  );
}