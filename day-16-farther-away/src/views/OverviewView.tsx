import {
  motion,
} from "motion/react";

import ResultStrip from "../components/ResultStrip";

import {
  formatNairaCompact,
} from "../lib/currency";

import {
  comparisonSummary,
  weekHoursLabel,
} from "../lib/summary";

import type {
  ComparisonDraft,
  ComparisonMetrics,
} from "../types/comparison";

export default function OverviewView({
  draft,
  metrics,
}: {
  draft: ComparisonDraft;
  metrics: ComparisonMetrics;
}) {
  const homes = [
    {
      label: "HOME A",
      home: draft.homeA,
      metric: metrics.homeA,
      accent: "text-ink",
    },
    {
      label: "HOME B",
      home: draft.homeB,
      metric: metrics.homeB,
      accent: "text-cobalt",
    },
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="space-y-7"
    >
      <div>
        <p
          className="
            font-mono
            text-[10px]
            text-muted
          "
        >
          SYNTHESIS // OVERVIEW
        </p>

        <h1
          className="
            mt-2
            font-serif
            text-5xl
          "
        >
          THE TRADE-OFF
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
          {comparisonSummary(
            draft,
            metrics,
          )}
        </p>
      </div>

      <div
        className="
          grid
          border
          border-line
          md:grid-cols-2
          md:divide-x
          md:divide-line
        "
      >
        {homes.map(
          ({
            label,
            home,
            metric,
            accent,
          }) => (
            <section
              key={label}
              className="
                p-5
                md:p-8
              "
            >
              <div
                className="
                  flex
                  items-baseline
                  justify-between
                  border-b
                  border-line
                  pb-4
                "
              >
                <h2
                  className="
                    font-serif
                    text-2xl
                    uppercase
                  "
                >
                  {label} ·{" "}
                  {home.name}
                </h2>

                <span
                  className={`
                    font-mono
                    text-[10px]
                    ${accent}
                  `}
                >
                  {home.mode.toUpperCase()}
                </span>
              </div>

              <div
                className="
                  mt-6
                  grid
                  gap-6
                "
              >
                <div>
                  <p
                    className="
                      font-mono
                      text-3xl
                    "
                  >
                    {formatNairaCompact(
                      metric.annualCashCost,
                    )}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      font-semibold
                      tracking-[0.08em]
                      text-muted
                    "
                  >
                    CASH / YEAR
                  </p>
                </div>

                <div>
                  <p
                    className="
                      font-mono
                      text-3xl
                    "
                  >
                    {Math.round(
                      metric.annualCommuteHours,
                    )}
                    H
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      font-semibold
                      tracking-[0.08em]
                      text-muted
                    "
                  >
                    COMMUTE / YEAR
                  </p>
                </div>

                <div>
                  <p
                    className="
                      font-mono
                      text-base
                    "
                  >
                    {weekHoursLabel(
                      metric.weeklyCommuteHours,
                    )}{" "}
                    / WK
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      font-semibold
                      tracking-[0.08em]
                      text-muted
                    "
                  >
                    RECURRING TRANSIT
                  </p>
                </div>
              </div>
            </section>
          ),
        )}
      </div>

      <ResultStrip
        cashSavingsB={
          metrics.cashSavingsB
        }
        extraHoursB={
          metrics.extraHoursB
        }
        bName={
          draft.homeB.name
        }
      />
    </motion.div>
  );
}