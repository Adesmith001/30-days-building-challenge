import { motion } from "motion/react"

import type {
  FundingSource,
  SimulationState,
} from "../types/simulation"

import { formatNaira } from "../lib/currency"

interface Props {
  state: SimulationState
  onFund: (source: FundingSource) => void
}

export function FundingStage({
  state,
  onFund,
}: Props) {
  const pending = state.pendingPayment

  if (!pending) {
    return null
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl"
    >
      <p className="font-mono text-[10px] tracking-[0.16em] text-orange">
        LIQUIDITY SHORTFALL
      </p>

      <h1 className="mt-5 font-editorial text-6xl leading-[0.92] tracking-[-0.05em] md:text-8xl">
        PAY FROM
        <br />
        <em>WHERE?</em>
      </h1>

      <p className="mt-7 max-w-xl font-body text-graphite">
        Cash absorbed part of the expense. There is still{" "}
        <strong>{formatNaira(pending.remaining)}</strong>{" "}
        to cover.
      </p>

      <div className="mt-12 grid border border-rule md:grid-cols-3">
        {[
          {
            label: "BUFFER",
            value: state.buffer,
            source: "buffer" as const,
          },
          {
            label: "RENT POT",
            value: state.rentPot,
            source: "rent" as const,
          },
          {
            label: "CARRY SHORTFALL",
            value: pending.remaining,
            source: "deficit" as const,
          },
        ].map((item, index) => {
          const unavailable =
            item.source !== "deficit" &&
            item.value <= 0

          return (
            <button
              type="button"
              key={item.label}
              disabled={unavailable}
              onClick={() => onFund(item.source)}
              className={`p-7 text-left transition-colors hover:bg-paper-deep disabled:opacity-30 ${
                index < 2
                  ? "border-b border-rule md:border-b-0 md:border-r"
                  : ""
              }`}
            >
              <span className="font-mono text-[9px] tracking-[0.15em] text-muted">
                {item.label}
              </span>

              <span className="mt-4 block font-mono text-2xl tracking-[-0.04em]">
                {formatNaira(item.value)}
              </span>

              {item.source === "rent" && (
                <span className="mt-4 block font-body text-xs leading-5 text-red">
                  Using rent increases the remaining rent gap.
                </span>
              )}
            </button>
          )
        })}
      </div>
    </motion.section>
  )
}