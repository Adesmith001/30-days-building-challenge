import type { SimulationState } from "../types/simulation"

import {
  formatCompactNaira,
  formatNaira,
} from "../lib/currency"

interface Props {
  title: string
  state: SimulationState
  highlighted?: boolean
}

export function ComparisonPanel({
  title,
  state,
  highlighted = false,
}: Props) {
  const percentage = Math.min(
    100,
    (state.rentPot / state.profile.annualRent) * 100,
  )

  return (
    <div
      className={`relative border p-7 ${
        highlighted
          ? "border-ink bg-paper"
          : "border-rule bg-paper-soft"
      }`}
    >
      {highlighted && (
        <span className="absolute right-5 top-0 -translate-y-1/2 bg-ink px-3 py-1 font-mono text-[8px] tracking-[0.14em] text-paper">
          COUNTERFACTUAL
        </span>
      )}

      <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
        RUN MODEL
      </p>

      <h3 className="mt-2 font-editorial text-3xl">
        {title}
      </h3>

      <p className="mt-2 font-mono text-[9px] tracking-[0.12em]">
        ANNUAL RENT{" "}
        {formatNaira(state.profile.annualRent)}
      </p>

      <div className="my-6 border-t border-rule" />

      {[
        [
          "FINAL SURVIVAL SCORE",
          state.score.toLocaleString(),
        ],
        [
          "RENT FUNDED",
          `${percentage.toFixed(1)}%`,
        ],
        [
          "ENDING BUFFER",
          formatCompactNaira(state.buffer),
        ],
        [
          "ENDING CASH",
          formatCompactNaira(state.cash),
        ],
        [
          "RENT GAP",
          state.rentShortfall > 0
            ? formatNaira(state.rentShortfall)
            : "₦0",
        ],
      ].map(([label, value]) => (
        <div
          key={label}
          className="flex items-center justify-between border-b border-rule py-4 font-mono"
        >
          <span className="text-[9px] tracking-[0.12em] text-muted">
            {label}
          </span>

          <span className="text-lg">
            {value}
          </span>
        </div>
      ))}

      <p
        className={`mt-6 font-mono text-[9px] tracking-[0.15em] ${
          state.rentStatus === "covered"
            ? "text-green"
            : "text-red"
        }`}
      >
        ■{" "}
        {state.rentStatus === "covered"
          ? "RENT COVERED"
          : "RENT SHORT"}
      </p>
    </div>
  )
}