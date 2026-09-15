import { useState } from "react"
import { Share2 } from "lucide-react"

import type { SimulationState } from "../types/simulation"

import { MoneyFlow } from "../components/MoneyFlow"

import {
  formatNaira,
} from "../lib/currency"

import { getScoreLabel } from "../lib/scoring"
import { shareRun } from "../lib/share"

interface Props {
  state: SimulationState
  personalBest: number
  onCompare: () => void
  onHistory: () => void
  onNewRun: () => void
}

export function ResultsScreen({
  state,
  personalBest,
  onCompare,
  onHistory,
  onNewRun,
}: Props) {
  const [shared, setShared] = useState(false)

  const monthsSurvived = state.months.length

  const rentPercent = Math.min(
    100,
    Math.round(
      (state.rentPot / state.profile.annualRent) *
        100,
    ),
  )

  const completeYear = monthsSurvived === 12

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-12 md:px-12">
      <div className="flex justify-between border-b border-rule pb-5 font-mono text-[9px] tracking-[0.15em]">
        <span>
          CYCLE {monthsSurvived} / 12
        </span>

        <span
          className={
            state.rentStatus === "covered"
              ? "text-green"
              : "text-red"
          }
        >
          STATUS:{" "}
          {state.rentStatus === "covered"
            ? "SURVIVED & SETTLED"
            : "RENT CAME UP SHORT"}
        </span>

        <span>
          SCORE {state.score.toLocaleString()}
        </span>
      </div>

      <section className="mt-12">
        <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
          SIMULATION HORIZON CONCLUDED
        </p>

        <h1 className="mt-4 font-editorial text-6xl tracking-[-0.05em] md:text-8xl">
          {completeYear
            ? "12 MONTHS LATER."
            : "THE DEADLINE ARRIVED."}
        </h1>
      </section>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <section className="border border-rule bg-paper-soft p-7">
          <div className="flex justify-between font-mono text-[9px] tracking-[0.14em] text-muted">
            <span>SURVIVAL SCORE</span>
            <span>DAY 15</span>
          </div>

          <p className="mt-10 font-mono text-5xl tracking-[-0.06em] md:text-6xl">
            {state.score.toLocaleString()}
          </p>

          <span className="mt-5 inline-block border border-green px-3 py-1 font-mono text-[8px] tracking-[0.12em] text-green">
            ■ {getScoreLabel(state.score)}
          </span>

          {state.score >= personalBest && (
            <p className="mt-5 font-mono text-[9px] tracking-[0.13em] text-green">
              NEW PERSONAL BEST
            </p>
          )}
        </section>

        <section className="border border-rule">
          <div className="border-b border-rule bg-paper-soft px-6 py-4 font-mono text-[9px] tracking-[0.14em]">
            AUDITED LEDGER AGGREGATES
          </div>

          {[
            [
              "RENT",
              state.rentStatus === "covered"
                ? "COVERED"
                : `${rentPercent}% FUNDED`,
            ],
            [
              "ENDING BUFFER",
              formatNaira(state.buffer),
            ],
            [
              "ENDING CASH",
              formatNaira(state.cash),
            ],
            [
              "CLEAN MONTHS",
              `${state.cleanMonths} / ${monthsSurvived}`,
            ],
            [
              "RENT WITHDRAWALS",
              String(state.rentWithdrawalCount),
            ],
            [
              "UNEXPECTED COSTS",
              formatNaira(state.unexpectedCosts),
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between border-b border-rule px-6 py-5 last:border-b-0"
            >
              <span className="font-body text-sm">
                {label}
              </span>

              <span className="font-mono text-lg">
                {value}
              </span>
            </div>
          ))}
        </section>
      </div>

      <div className="mt-14">
        <MoneyFlow state={state} />
      </div>

      <div className="mt-14 flex flex-wrap gap-3 border-t border-rule pt-8">
        <button
          type="button"
          onClick={onCompare}
          className="bg-ink px-7 py-4 font-mono text-[9px] tracking-[0.14em] text-paper"
        >
          CHANGE ONE THING →
        </button>

        <button
          type="button"
          onClick={async () => {
            await shareRun(state)
            setShared(true)
          }}
          className="flex items-center gap-3 border border-ink px-7 py-4 font-mono text-[9px] tracking-[0.14em]"
        >
          <Share2 size={14} />
          {shared ? "COPIED / SHARED" : "SHARE RESULT"}
        </button>

        <button
          type="button"
          onClick={onHistory}
          className="border border-rule px-7 py-4 font-mono text-[9px] tracking-[0.14em]"
        >
          RUN HISTORY
        </button>

        <button
          type="button"
          onClick={onNewRun}
          className="px-7 py-4 font-mono text-[9px] tracking-[0.14em] text-muted"
        >
          NEW RUN
        </button>
      </div>
    </main>
  )
}