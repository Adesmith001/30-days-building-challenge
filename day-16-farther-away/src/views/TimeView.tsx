import {
  motion,
} from "motion/react";

import MetricTable from "../components/MetricTable";
import YearTimeGrid from "../components/YearTimeGrid";

import {
  weekHoursLabel,
} from "../lib/summary";

import type {
  ComparisonDraft,
  ComparisonMetrics,
} from "../types/comparison";

export default function TimeView({
  draft,
  metrics,
}: {
  draft: ComparisonDraft;
  metrics: ComparisonMetrics;
}) {
  const rows = (
    home: "a" | "b",
  ) => {
    const option =
      home === "a"
        ? draft.homeA
        : draft.homeB;

    const data =
      home === "a"
        ? metrics.homeA
        : metrics.homeB;

    return [
      {
        label: "One way",
        value:
          `${option.oneWayMinutes} MIN`,
      },
      {
        label: "Round trip",
        value:
          `${option.oneWayMinutes * 2} MIN`,
      },
      {
        label: "Per week",
        value:
          weekHoursLabel(
            data.weeklyCommuteHours,
          ),
      },
      {
        label: "Per year",
        value:
          `${Math.round(
            data.annualCommuteHours,
          )} HOURS`,
      },
      {
        label:
          "24-hour day equivalent",
        value:
          `${data.commuteDayEquivalent.toFixed(
            1,
          )} DAYS`,
      },
    ];
  };

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
          TIME // ANNUAL
          COMMUTE LOAD
        </p>

        <h1
          className="
            mt-2
            font-serif
            text-5xl
          "
        >
          NOW THE PART
          MONEY MISSES.
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
          Hours are kept
          separate from cash.
          Day equivalents use
          24 hours and are only
          a way to make the
          scale easier to feel.
        </p>
      </header>

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
        "
      >
        <MetricTable
          title={
            `HOME A · ${draft.homeA.name}`
          }
          subtitle="TIME LEDGER"
          rows={rows("a")}
        />

        <MetricTable
          title={
            `HOME B · ${draft.homeB.name}`
          }
          subtitle="TIME LEDGER"
          rows={rows("b")}
        />
      </div>

      <section
        className="
          border
          border-line
          p-5
          md:p-8
        "
      >
        <div className="mb-7">
          <p
            className="
              font-mono
              text-[10px]
              text-muted
            "
          >
            YOUR COMMUTE YEAR //
            365 CELLS
          </p>

          <h2
            className="
              mt-2
              font-serif
              text-3xl
            "
          >
            A YEAR, CONVERTED
            INTO TIME.
          </h2>
        </div>

        <div
          className="
            grid
            gap-10
            md:grid-cols-2
          "
        >
          <YearTimeGrid
            label={
              `HOME A · ${draft.homeA.name}`
            }
            days={
              metrics.homeA
                .commuteDayEquivalent
            }
            tone="ink"
          />

          <YearTimeGrid
            label={
              `HOME B · ${draft.homeB.name}`
            }
            days={
              metrics.homeB
                .commuteDayEquivalent
            }
            tone="time"
          />
        </div>
      </section>

      <div
        className="
          border-y
          border-line
          py-7
          text-center
        "
      >
        <p
          className="
            font-mono
            text-4xl
            text-time
          "
        >
          {metrics.extraHoursB >= 0
            ? "+"
            : "-"}
          {Math.abs(
            Math.round(
              metrics.extraHoursB,
            ),
          )}{" "}
          HOURS / YEAR
        </p>

        <p
          className="
            mt-2
            font-serif
            text-xl
          "
        >
          {Math.abs(
            metrics.extraCommuteDaysB,
          ).toFixed(1)}
          {" "}× 24-HOUR DAYS
          OF DIFFERENCE
        </p>
      </div>
    </motion.div>
  );
}