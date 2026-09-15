import type { FinancialProfile } from "../types/simulation"

import {
  formatNaira,
} from "../lib/currency"

import {
  expensesTotal,
  startingRentTarget,
} from "../lib/finances"

interface Props {
  profile: FinancialProfile
  onStart: () => void
}

export function PreviewScreen({
  profile,
  onStart,
}: Props) {
  const rent = startingRentTarget(profile)
  const normal = expensesTotal(profile.expenses)

  const left =
    profile.monthlyIncome - rent - normal

  const rows = [
    ["INCOME", profile.monthlyIncome, true],
    ["RENT POT", -rent, false],
    ["FOOD", -profile.expenses.food, false],
    [
      "TRANSPORT",
      -profile.expenses.transport,
      false,
    ],
    ["UTILITIES", -profile.expenses.power, false],
    ["DATA", -profile.expenses.data, false],
    [
      "SUBSCRIPTIONS",
      -profile.expenses.subscriptions,
      false,
    ],
    ["DEBT", -profile.expenses.debt, false],
    ["OTHER", -profile.expenses.other, false],
  ] as const

  return (
    <main className="mx-auto max-w-[1050px] px-5 py-12 md:px-12 md:py-16">
      <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
        PRE-SIMULATION AUDIT
      </p>

      <h1 className="mt-4 font-editorial text-6xl tracking-[-0.05em] md:text-8xl">
        YOUR MONTH
        <br />
        <em>ON PAPER.</em>
      </h1>

      <div className="mt-12 border-y border-rule">
        {rows.map(([label, value, positive]) => (
          <div
            key={label}
            className="flex justify-between border-b border-rule py-4 font-mono last:border-b-0"
          >
            <span className="text-[10px] tracking-[0.12em] text-muted">
              {label}
            </span>

            <span
              className={
                positive
                  ? "text-green"
                  : "text-ink"
              }
            >
              {positive ? "+" : ""}
              {formatNaira(value)}
            </span>
          </div>
        ))}

        <div className="flex justify-between border-t border-ink py-6 font-mono text-lg">
          <span>LEFT</span>

          <span
            className={
              left >= 0
                ? "text-green"
                : "text-red"
            }
          >
            {formatNaira(left)}
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 className="font-editorial text-3xl">
            {left >= 0
              ? "Looks manageable on paper."
              : "The paper version is already tight."}
          </h2>

          <p className="mt-2 font-body text-graphite">
            Life is about to get involved.
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="bg-ink px-8 py-5 font-mono text-[10px] tracking-[0.15em] text-paper"
        >
          START JANUARY →
        </button>
      </div>
    </main>
  )
}