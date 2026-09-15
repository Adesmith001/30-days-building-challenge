import { motion } from "motion/react"

import type { SimulationState } from "../types/simulation"

import { formatNaira } from "../lib/currency"

interface Props {
  state: SimulationState
  monthsAway: number
  onContinue: () => void
}

export function RentWarningStage({
  state,
  monthsAway,
  onContinue,
}: Props) {
  const gap = Math.max(
    0,
    state.profile.annualRent - state.rentPot,
  )

  const oneMonth = monthsAway === 1

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl py-16 md:py-24"
    >
      <p className="font-mono text-[10px] tracking-[0.17em] text-orange">
        DEADLINE COMPRESSION
      </p>

      <h1 className="mt-5 font-editorial text-6xl leading-[0.92] tracking-[-0.05em] md:text-8xl">
        {oneMonth ? (
          <>
            NEXT MONTH:
            <br />
            <em>RENT.</em>
          </>
        ) : (
          <>
            RENT IS
            <br />
            <em>GETTING CLOSE.</em>
          </>
        )}
      </h1>

      <div className="mt-12 grid gap-px border border-rule bg-rule sm:grid-cols-2">
        {[
          ["CURRENT RENT POT", formatNaira(state.rentPot)],
          ["NEEDED", formatNaira(state.profile.annualRent)],
          ["GAP", formatNaira(gap)],
          [
            "REQUIRED PACE",
            `${formatNaira(
              state.current.rentTarget,
            )} / MONTH`,
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-paper p-6"
          >
            <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
              {label}
            </p>

            <p className="mt-3 font-mono text-xl tracking-[-0.03em]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-10 bg-ink px-7 py-4 font-mono text-[10px] tracking-[0.15em] text-paper"
      >
        FACE {state.current.name} →
      </button>
    </motion.section>
  )
}