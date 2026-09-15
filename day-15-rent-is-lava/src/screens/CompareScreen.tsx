import { useMemo, useState } from "react"

import type {
  CompareVariable,
  FinancialProfile,
  ScenarioComparison,
  SimulationState,
} from "../types/simulation"

import { ComparisonPanel } from "../components/ComparisonPanel"
import { MoneyInput } from "../components/MoneyInput"
import { runScenario } from "../lib/scenario"

interface Props {
  original: SimulationState
  onBack: () => void
  onSave: (comparison: ScenarioComparison) => void
}

const labels: Record<CompareVariable, string> = {
  annualRent: "ANNUAL RENT",
  monthlyIncome: "MONTHLY INCOME",
  food: "MONTHLY FOOD",
  transport: "MONTHLY TRANSPORT",
  startingBuffer: "STARTING BUFFER",
}

function currentValue(
  profile: FinancialProfile,
  variable: CompareVariable,
) {
  if (variable === "food") {
    return profile.expenses.food
  }

  if (variable === "transport") {
    return profile.expenses.transport
  }

  return profile[variable]
}

function changeProfile(
  profile: FinancialProfile,
  variable: CompareVariable,
  value: number,
) {
  if (
    variable === "food" ||
    variable === "transport"
  ) {
    return {
      ...profile,
      expenses: {
        ...profile.expenses,
        [variable]: value,
      },
    }
  }

  return {
    ...profile,
    [variable]: value,
  }
}

export function CompareScreen({
  original,
  onBack,
  onSave,
}: Props) {
  const [variable, setVariable] =
    useState<CompareVariable>("annualRent")

  const originalValue = currentValue(
    original.profile,
    variable,
  )

  const [value, setValue] = useState(
    Math.round(original.profile.annualRent * 0.9),
  )

  const [result, setResult] =
    useState<SimulationState | null>(null)

  const [replaying, setReplaying] = useState(false)
  const [saved, setSaved] = useState(false)

  const comparison = useMemo<
    ScenarioComparison | null
  >(() => {
    if (!result) return null

    return {
      variable,
      originalValue,
      scenarioValue: value,
      resultScore: result.score,
      rentStatus: result.rentStatus,
      rentShortfall: result.rentShortfall,
      endingBuffer: result.buffer,
      endingCash: result.cash,
    }
  }, [
    result,
    variable,
    originalValue,
    value,
  ])

  const selectVariable = (
    next: CompareVariable,
  ) => {
    setVariable(next)

    const base = currentValue(
      original.profile,
      next,
    )

    setValue(base)
    setResult(null)
    setSaved(false)
  }

  const replay = () => {
    setReplaying(true)

    const profile = changeProfile(
      original.profile,
      variable,
      value,
    )

    window.setTimeout(() => {
      const scenario = runScenario(
        profile,
        original.seed,
        original.decisionChoices,
        original.fundingChoices,
      )

      setResult(scenario)
      setReplaying(false)
    }, 550)
  }

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-12 md:px-12">
      <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
        COUNTERFACTUAL SYNTHESIS
      </p>

      <div className="mt-4 grid gap-8 border-b border-rule pb-10 lg:grid-cols-2 lg:items-end">
        <h1 className="font-editorial text-6xl tracking-[-0.05em] md:text-8xl">
          ONE CHANGE.
        </h1>

        <p className="border-l border-ink pl-6 font-body leading-7 text-graphite">
          Same surprises. Same month-to-month variation.
          Same decision outcomes. Only one financial
          variable changes.
        </p>
      </div>

      {!result && (
        <section className="mt-10">
          <div className="flex flex-wrap gap-2">
            {(
              Object.keys(labels) as CompareVariable[]
            ).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => selectVariable(item)}
                className={`border px-4 py-3 font-mono text-[8px] tracking-[0.12em] ${
                  variable === item
                    ? "border-ink bg-ink text-paper"
                    : "border-rule"
                }`}
              >
                {labels[item]}
              </button>
            ))}
          </div>

          <div className="mt-8 max-w-2xl">
            <MoneyInput
              label={labels[variable]}
              help={`Original: ₦${originalValue.toLocaleString()}`}
              value={value}
              onChange={setValue}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setValue(
                  Math.round(originalValue * 0.9),
                )
              }
              className="border border-rule px-4 py-3 font-mono text-[9px]"
            >
              -10%
            </button>

            <button
              type="button"
              onClick={() =>
                setValue(
                  Math.round(originalValue * 1.1),
                )
              }
              className="border border-rule px-4 py-3 font-mono text-[9px]"
            >
              +10%
            </button>

            <button
              type="button"
              onClick={() =>
                setValue(
                  Math.round(originalValue * 0.8),
                )
              }
              className="border border-rule px-4 py-3 font-mono text-[9px]"
            >
              -20%
            </button>
          </div>

          <button
            type="button"
            onClick={replay}
            disabled={replaying}
            className="mt-8 bg-ink px-8 py-5 font-mono text-[10px] tracking-[0.15em] text-paper disabled:opacity-50"
          >
            {replaying
              ? "REPLAYING SAME YEAR..."
              : "REPLAY SAME YEAR →"}
          </button>
        </section>
      )}

      {result && (
        <>
          <div className="mt-12 grid gap-7 lg:grid-cols-2">
            <ComparisonPanel
              title="ORIGINAL RUN"
              state={original}
            />

            <ComparisonPanel
              title="WHAT IF?"
              state={result}
              highlighted
            />
          </div>

          <section className="mt-8 grid gap-8 border border-rule bg-paper-deep p-8 md:grid-cols-2">
            <div>
              <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
                SCORE DELTA
              </p>

              <p className="mt-4 font-mono text-4xl tracking-[-0.05em] text-green">
                {result.score - original.score >= 0
                  ? "+"
                  : ""}
                {(
                  result.score - original.score
                ).toLocaleString()}
              </p>

              <p className="mt-3 font-mono text-[9px] tracking-[0.14em]">
                SAME YEAR. SAME EVENTS. DIFFERENT NUMBERS.
              </p>
            </div>

            <p className="font-editorial text-2xl italic leading-9">
              In this simulated year, changing only{" "}
              {labels[variable].toLowerCase()} changed
              the final liquidity path while every
              seeded life event remained fixed.
            </p>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (comparison) {
                  onSave(comparison)
                  setSaved(true)
                }
              }}
              className="bg-ink px-7 py-4 font-mono text-[9px] tracking-[0.14em] text-paper"
            >
              {saved
                ? "SAVED TO RUN"
                : "SAVE COMPARISON →"}
            </button>

            <button
              type="button"
              onClick={() => {
                setResult(null)
                setSaved(false)
              }}
              className="border border-ink px-7 py-4 font-mono text-[9px] tracking-[0.14em]"
            >
              TEST ANOTHER VARIABLE
            </button>

            <button
              type="button"
              onClick={onBack}
              className="px-7 py-4 font-mono text-[9px] tracking-[0.14em] text-muted"
            >
              BACK TO RESULT
            </button>
          </div>
        </>
      )}
    </main>
  )
}