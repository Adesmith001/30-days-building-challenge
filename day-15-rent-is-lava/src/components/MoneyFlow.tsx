import type { SimulationState } from "../types/simulation"

import { formatNaira } from "../lib/currency"

interface Props {
  state: SimulationState
}

export function MoneyFlow({ state }: Props) {
  const sums = state.months.reduce(
    (total, month) => ({
      rent:
        total.rent +
        month.rentContribution,
      food:
        total.food + month.expenses.food,
      transport:
        total.transport +
        month.expenses.transport,
      utilities:
        total.utilities +
        month.expenses.power +
        month.expenses.data,
      other:
        total.other +
        month.expenses.other +
        month.expenses.subscriptions +
        month.expenses.debt,
      events:
        total.events + month.eventCost,
    }),
    {
      rent: 0,
      food: 0,
      transport: 0,
      utilities: 0,
      other: 0,
      events: 0,
    },
  )

  const rows = [
    ["RENT SAVED", sums.rent],
    ["FOOD", sums.food],
    ["TRANSPORT", sums.transport],
    ["UTILITIES / DATA", sums.utilities],
    ["OTHER", sums.other],
    ["EVENTS", sums.events],
  ] as const

  const maximum = Math.max(
    ...rows.map(([, value]) => value),
    1,
  )

  return (
    <section>
      <div className="flex items-end justify-between border-b border-rule pb-4">
        <div>
          <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
            ANNUAL MONEY FLOW
          </p>

          <h2 className="mt-2 font-editorial text-4xl">
            WHERE YOUR SALARY WENT.
          </h2>
        </div>

        <p className="hidden font-mono text-sm md:block">
          {formatNaira(state.totalIncome)}
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {rows.map(([label, value]) => (
          <div key={label}>
            <div className="mb-2 flex justify-between font-mono text-[10px]">
              <span>{label}</span>
              <span>{formatNaira(value)}</span>
            </div>

            <div className="h-[5px] bg-rule">
              <div
                className="h-full bg-ink"
                style={{
                  width: `${Math.max(
                    2,
                    (value / maximum) * 100,
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}