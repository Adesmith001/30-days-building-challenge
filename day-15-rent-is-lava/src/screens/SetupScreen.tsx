import type { FinancialProfile } from "../types/simulation"

import { MoneyInput } from "../components/MoneyInput"

import {
  formatNaira,
  formatNumber,
} from "../lib/currency"

import { startingRentTarget } from "../lib/finances"

interface Props {
  profile: FinancialProfile
  onChange: (profile: FinancialProfile) => void
  onContinue: () => void
}

export function SetupScreen({
  profile,
  onChange,
  onContinue,
}: Props) {
  const update = (
    key: keyof FinancialProfile,
    value: number,
  ) => {
    onChange({
      ...profile,
      [key]: value,
    })
  }

  const target = startingRentTarget(profile)

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-10 md:px-12">
      <div className="flex justify-between border-b border-rule pb-5 font-mono text-[9px] tracking-[0.15em]">
        <span>SCHEDULE A // BASELINE AUDIT</span>

        <span className="text-green">
          ● CALIBRATING PROFILE
        </span>
      </div>

      <section className="mt-10 max-w-3xl">
        <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
          ENTRY PROTOCOL · FORM 03
        </p>

        <h1 className="mt-4 font-editorial text-6xl leading-[0.9] tracking-[-0.05em] md:text-8xl">
          WHAT ARE WE
          <br />
          <em>WORKING WITH?</em>
        </h1>

        <p className="mt-7 max-w-xl font-body leading-7 text-graphite">
          Input the financial baseline. Use real or
          fictional numbers; nothing connects to your bank.
        </p>
      </section>

      <section className="mt-12">
        <MoneyInput
          label="MONTHLY TAKE-HOME"
          help="Net income entering the simulation each month"
          value={profile.monthlyIncome}
          onChange={(value) =>
            update("monthlyIncome", value)
          }
        />

        <MoneyInput
          label="ANNUAL RENT"
          help="Total annual rent due at the deadline"
          value={profile.annualRent}
          onChange={(value) =>
            update("annualRent", value)
          }
        />

        <div className="grid gap-4 border-t border-rule py-6 md:grid-cols-[1fr_1.2fr] md:items-center md:py-7">
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-graphite">
              RENT DUE IN
            </p>

            <p className="mt-1 font-body text-xs text-muted">
              Remaining runway before the rent deadline
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <input
              inputMode="numeric"
              value={formatNumber(
                profile.rentDueInMonths,
              )}
              onChange={(event) => {
                const value = Math.min(
                  12,
                  Math.max(
                    1,
                    Number(
                      event.target.value.replace(
                        /\D/g,
                        "",
                      ),
                    ) || 1,
                  ),
                )

                update("rentDueInMonths", value)
              }}
              className="w-16 bg-transparent text-right font-mono text-3xl outline-none"
            />

            <span className="font-mono text-2xl">
              MONTHS
            </span>
          </div>
        </div>

        <MoneyInput
          label="ALREADY SAVED FOR RENT"
          help="Money already reserved for the next rent"
          value={profile.rentSaved}
          onChange={(value) =>
            update("rentSaved", value)
          }
        />

        <MoneyInput
          label="EMERGENCY BUFFER"
          help="Liquid reserve available for unexpected costs"
          value={profile.startingBuffer}
          onChange={(value) =>
            update("startingBuffer", value)
          }
        />
      </section>

      <div className="mt-8 flex flex-col justify-between gap-8 border-t border-rule pt-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[8px] tracking-[0.14em] text-muted">
            MONTHLY RENT TARGET
          </p>

          <p className="mt-1 font-mono text-2xl tracking-[-0.04em]">
            {formatNaira(target)}
            <span className="text-xs text-muted">
              {" "}
              / MO
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={
            profile.monthlyIncome <= 0 ||
            profile.annualRent <= 0
          }
          className="bg-ink px-8 py-4 font-mono text-[10px] tracking-[0.15em] text-paper disabled:opacity-30"
        >
          CONTINUE →
        </button>
      </div>
    </main>
  )
}