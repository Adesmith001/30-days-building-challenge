import { useState } from "react"
import { motion } from "motion/react"

import type { SimulationState } from "../types/simulation"

import { formatNaira } from "../lib/currency"

interface Props {
  state: SimulationState
  onResolve: (choiceId?: string) => void
}

export function EventStage({
  state,
  onResolve,
}: Props) {
  const event = state.current.event

  const [choice, setChoice] = useState<string | null>(
    event?.choices?.[0]?.id ?? null,
  )

  if (!event) {
    return null
  }

  if (event.kind === "decision") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl border border-rule"
      >
        <div className="flex justify-between border-b border-rule bg-paper-soft px-6 py-4 font-mono text-[9px] tracking-[0.15em]">
          <span>
            {state.current.name} · DILEMMA EVENT
          </span>

          <span>■ DECISION REQUIRED</span>
        </div>

        <div className="px-6 py-10 md:px-10 md:py-12">
          <h1 className="max-w-4xl font-editorial text-5xl leading-[0.95] tracking-[-0.04em] md:text-7xl">
            {event.title}
          </h1>

          <p className="mt-7 font-body text-lg text-graphite">
            {event.description}
          </p>
        </div>

        <div className="grid border-t border-rule md:grid-cols-2">
          {event.choices?.map((item, index) => {
            const selected = choice === item.id

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setChoice(item.id)}
                className={`border-b border-rule p-7 text-left md:border-b-0 ${
                  index === 0
                    ? "md:border-r"
                    : ""
                } ${
                  selected
                    ? "bg-paper-deep"
                    : "bg-paper"
                }`}
              >
                <div className="flex justify-between font-mono text-[9px] tracking-[0.15em] text-muted">
                  <span>
                    OPTION {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`h-4 w-4 border border-ink ${
                      selected ? "bg-ink" : ""
                    }`}
                  />
                </div>

                <p className="mt-7 font-mono text-[10px] tracking-[0.15em]">
                  {item.label}
                </p>

                <p className="mt-2 font-mono text-4xl tracking-[-0.06em]">
                  {formatNaira(item.amount)}
                </p>

                <div className="my-6 border-t border-rule" />

                <p className="font-body text-sm text-graphite">
                  {item.description}
                </p>
              </button>
            )
          })}
        </div>

        <div className="flex justify-end border-t border-rule p-6">
          <button
            type="button"
            disabled={!choice}
            onClick={() =>
              choice && onResolve(choice)
            }
            className="bg-ink px-7 py-4 font-mono text-[10px] tracking-[0.15em] text-paper disabled:opacity-30"
          >
            SELECT CHOICE →
          </button>
        </div>
      </motion.section>
    )
  }

  const amount =
    event.kind === "cost"
      ? -(event.amount ?? 0)
      : event.amount ?? 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl border border-rule bg-paper"
    >
      <div className="flex justify-between border-b border-rule px-6 py-5 font-mono text-[9px] tracking-[0.15em]">
        <span>
          ■ {state.current.name} // LIFE EVENT
        </span>

        <span className="text-muted">
          {event.classification}
        </span>
      </div>

      <div className="p-7 md:p-12">
        <h1 className="font-editorial text-5xl leading-[0.95] tracking-[-0.04em] md:text-7xl">
          {event.title}
        </h1>

        <p className="mt-8 max-w-xl font-body text-lg leading-8 text-graphite">
          {event.description}
        </p>

        <div className="my-10 border-t border-rule" />

        {event.kind === "recurring" ? (
          <div>
            <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
              RECURRING CHANGE REGISTERED
            </p>

            <p className="mt-3 font-mono text-3xl tracking-[-0.04em] text-orange">
              MONTHLY COST BASE CHANGES
            </p>
          </div>
        ) : (
          <div>
            <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
              IMMEDIATE LIQUIDITY IMPACT
            </p>

            <p
              className={`mt-3 font-mono text-5xl tracking-[-0.06em] ${
                amount > 0
                  ? "text-green"
                  : "text-ink"
              }`}
            >
              {formatNaira(amount)}
            </p>
          </div>
        )}

        <div className="mt-10 grid gap-px bg-rule sm:grid-cols-3">
          {[
            ["CURRENT CASH", formatNaira(state.cash)],
            ["BUFFER", formatNaira(state.buffer)],
            ["RENT POT", formatNaira(state.rentPot)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-paper-soft p-5"
            >
              <p className="font-mono text-[8px] tracking-[0.14em] text-muted">
                {label}
              </p>

              <p className="mt-2 font-mono text-lg">
                {value}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onResolve()}
          className="mt-8 bg-ink px-7 py-4 font-mono text-[10px] tracking-[0.15em] text-paper"
        >
          WRITE TO LEDGER →
        </button>
      </div>
    </motion.section>
  )
}