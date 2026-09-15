import { motion } from "motion/react"

import type { SimulationState } from "../types/simulation"

import { formatNaira } from "../lib/currency"
import { RentMeter } from "./RentMeter"
import { YearTimeline } from "./YearTimeline"

interface Props {
  state: SimulationState
  onNext: () => void
}

export function MonthSummary({
  state,
  onNext,
}: Props) {
  const month =
    state.months[state.months.length - 1]

  if (!month) {
    return null
  }

  const deadline =
    month.month === state.profile.rentDueInMonths

  const rentReady =
    month.scoreLabels.includes("RENT READY EARLY")

  const difficult =
    month.usedBuffer > 0 ||
    month.usedRent > 0

  let title = `${month.name}, DONE.`

  if (deadline && state.rentStatus === "covered") {
    title = "RENT COVERED."
  } else if (deadline && state.rentStatus === "short") {
    title = "RENT IS DUE."
  } else if (rentReady) {
    title = "RENT READY EARLY."
  } else if (month.clean) {
    title = "CLEAN MONTH."
  } else if (difficult) {
    title = "THAT MONTH FOUGHT BACK."
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl"
    >
      <p className="font-mono text-[10px] tracking-[0.16em] text-muted">
        MONTH {String(month.month).padStart(2, "0")} SETTLED
      </p>

      <h1 className="mt-5 font-editorial text-6xl tracking-[-0.05em] md:text-8xl">
        {title}
      </h1>

      {state.rentStatus === "short" && deadline && (
        <p className="mt-5 font-body text-lg text-graphite">
          The simulation reaches the deadline with a{" "}
          {formatNaira(state.rentShortfall)} rent gap.
        </p>
      )}

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_0.7fr]">
        <div className="border-y border-rule">
          {[
            ["INCOME", formatNaira(month.income)],
            [
              "NORMAL SPEND",
              formatNaira(month.normalExpenses),
            ],
            [
              "RENT SAVED",
              formatNaira(month.rentContribution),
            ],
            [
              "EVENT",
              month.eventCost > 0
                ? formatNaira(-month.eventCost)
                : month.eventIncome > 0
                  ? formatNaira(month.eventIncome)
                  : "—",
            ],
            ["ENDING CASH", formatNaira(month.cash)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between border-b border-rule py-4 font-mono text-sm last:border-b-0"
            >
              <span className="text-muted">
                {label}
              </span>

              <span>{value}</span>
            </div>
          ))}
        </div>

        <div className="border border-rule bg-paper-soft p-6">
          <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
            MONTH SCORE
          </p>

          <p className="mt-2 font-mono text-4xl tracking-[-0.06em]">
            +{month.scoreGain.toLocaleString()}
          </p>

          <div className="mt-6 space-y-2">
            {month.scoreLabels.slice(0, 5).map((label) => (
              <p
                key={label}
                className="font-mono text-[8px] tracking-[0.12em] text-muted"
              >
                ■ {label}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <RentMeter
          rentPot={state.rentPot}
          target={state.profile.annualRent}
        />
      </div>

      <div className="mt-10 border-t border-rule pt-8">
        <YearTimeline
          currentMonth={month.month}
          completedMonths={state.months.length}
          rentMonth={state.profile.rentDueInMonths}
        />
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-10 bg-ink px-7 py-4 font-mono text-[10px] tracking-[0.15em] text-paper"
      >
        {state.willEndAfterSummary
          ? "SEE THE RESULT →"
          : "NEXT MONTH →"}
      </button>
    </motion.section>
  )
}