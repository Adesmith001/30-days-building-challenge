import { motion } from "motion/react"

import type { SimulationState } from "../types/simulation"

import {
  essentialsTotal,
  flexTotal,
} from "../lib/finances"

import { formatNaira } from "../lib/currency"
import { RentMeter } from "./RentMeter"

interface Props {
  state: SimulationState
  onConfirm: () => void
}

export function PaydayStage({
  state,
  onConfirm,
}: Props) {
  const month = state.current

  const essentials = essentialsTotal(month.expenses)
  const flex = flexTotal(month.expenses)

  const projectedFree =
    month.income -
    month.normalExpenses -
    month.rentTarget

  const monthsLeft = Math.max(
    0,
    state.profile.rentDueInMonths -
      month.index,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]"
    >
      <section className="lg:border-r lg:border-rule lg:pr-12">
        <span className="border border-rule px-2 py-1 font-mono text-[9px] tracking-[0.15em]">
          LIQUIDITY INFLOW · TRANCHE{" "}
          {String(month.index + 1).padStart(2, "0")}
        </span>

        <h1 className="mt-6 font-editorial text-5xl leading-[0.95] tracking-[-0.04em] md:text-7xl">
          {month.name}
          <br />
          ALLOCATION
        </h1>

        <p className="mt-6 max-w-md font-body leading-7 text-graphite">
          Salary lands. Normal spending clears.
          The rent target is reserved before the
          month gets a chance to misbehave.
        </p>

        <div className="mt-10 border border-rule bg-paper-soft p-6">
          <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
            NET INCOMING CAPITAL
          </p>

          <p className="mt-2 font-mono text-4xl font-medium tracking-[-0.06em] md:text-5xl">
            {formatNaira(month.income)}
          </p>
        </div>
      </section>

      <section>
        <div className="border border-rule">
          <div className="flex justify-between border-b border-rule bg-paper-deep px-5 py-4 font-mono text-[9px] tracking-[0.15em]">
            <span>ALLOCATION LEDGER MATRIX</span>
            <span>MONTHLY</span>
          </div>

          {[
            {
              label: "RENT",
              value: month.rentTarget,
              note: "LOCKED PROVISION",
              accent: true,
            },
            {
              label: "ESSENTIALS",
              value: essentials,
              note: "FOOD · TRANSPORT · POWER · DATA · DEBT",
            },
            {
              label: "FLEX",
              value: flex,
              note: "OTHER · SUBSCRIPTIONS",
            },
            {
              label: "FREE / BUFFER",
              value: Math.max(0, projectedFree),
              note:
                projectedFree >= 0
                  ? "UNCOMMITTED LIQUIDITY"
                  : `${formatNaira(
                      Math.abs(projectedFree),
                    )} PRESSURE`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`grid grid-cols-[1fr_auto] gap-4 border-b border-rule px-5 py-5 last:border-b-0 ${
                item.accent
                  ? "border-l-4 border-l-orange"
                  : ""
              }`}
            >
              <div>
                <p className="font-body text-sm font-medium">
                  {item.label}
                </p>

                <p className="mt-1 font-mono text-[8px] tracking-[0.13em] text-muted">
                  {item.note}
                </p>
              </div>

              <p className="font-mono text-xl font-medium tracking-[-0.04em] md:text-2xl">
                {formatNaira(item.value)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <RentMeter
            rentPot={state.rentPot}
            target={state.profile.annualRent}
            monthsLeft={monthsLeft}
          />
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-8 flex w-full items-center justify-between bg-ink px-6 py-5 font-mono text-[10px] tracking-[0.15em] text-paper transition-opacity hover:opacity-80"
        >
          <span>CONFIRM ALLOCATION →</span>
          <span>EXECUTE MONTH</span>
        </button>
      </section>
    </motion.div>
  )
}