import type {
  ExpenseKey,
  FinancialProfile,
} from "../types/simulation"

import { MoneyInput } from "../components/MoneyInput"
import { formatNaira } from "../lib/currency"
import { expensesTotal } from "../lib/finances"

interface Props {
  profile: FinancialProfile
  onChange: (profile: FinancialProfile) => void
  onContinue: () => void
}

const rows: Array<{
  key: ExpenseKey
  label: string
  help: string
}> = [
  {
    key: "food",
    label: "FOOD",
    help: "Typical groceries and meals",
  },
  {
    key: "transport",
    label: "TRANSPORT",
    help: "Commute and normal movement",
  },
  {
    key: "power",
    label: "POWER / UTILITIES",
    help: "Power, generator and utilities",
  },
  {
    key: "data",
    label: "DATA / INTERNET",
    help: "Normal connectivity cost",
  },
  {
    key: "subscriptions",
    label: "SUBSCRIPTIONS",
    help: "Recurring discretionary services",
  },
  {
    key: "debt",
    label: "DEBT PAYMENTS",
    help: "Normal monthly repayments",
  },
  {
    key: "other",
    label: "OTHER",
    help: "Everything else in a normal month",
  },
]

export function ExpensesScreen({
  profile,
  onChange,
  onContinue,
}: Props) {
  const total = expensesTotal(profile.expenses)

  const change = (
    key: ExpenseKey,
    value: number,
  ) => {
    onChange({
      ...profile,
      expenses: {
        ...profile.expenses,
        [key]: value,
      },
    })
  }

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-10 md:px-12">
      <div className="border-b border-rule pb-5 font-mono text-[9px] tracking-[0.15em]">
        SCHEDULE B // MONTHLY BURN
      </div>

      <section className="mt-10">
        <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
          OPERATING COST PROFILE
        </p>

        <h1 className="mt-4 max-w-4xl font-editorial text-6xl leading-[0.92] tracking-[-0.05em] md:text-8xl">
          WHAT DOES A
          <br />
          <em>NORMAL MONTH COST?</em>
        </h1>
      </section>

      <section className="mt-12">
        {rows.map((row) => (
          <MoneyInput
            key={row.key}
            label={row.label}
            help={row.help}
            value={profile.expenses[row.key]}
            onChange={(value) =>
              change(row.key, value)
            }
          />
        ))}
      </section>

      <div className="mt-8 flex flex-col justify-between gap-7 border-t border-rule pt-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[8px] tracking-[0.14em] text-muted">
            NORMAL MONTH
          </p>

          <p className="mt-1 font-mono text-2xl">
            {formatNaira(total)}
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="bg-ink px-8 py-4 font-mono text-[10px] tracking-[0.15em] text-paper"
        >
          BUILD MY RUN →
        </button>
      </div>
    </main>
  )
}