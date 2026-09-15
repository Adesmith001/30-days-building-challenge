import type { SavedRun } from "../types/simulation"

import {
  formatCompactNaira,
} from "../lib/currency"

interface Props {
  runs: SavedRun[]
  onBack: () => void
  onNewRun: () => void
}

export function HistoryScreen({
  runs,
  onBack,
  onNewRun,
}: Props) {
  return (
    <main className="mx-auto max-w-[1000px] px-5 py-12 md:px-12">
      <div className="flex items-end justify-between border-b border-rule pb-8">
        <div>
          <p className="font-mono text-[9px] tracking-[0.15em] text-muted">
            ARCHIVE // LOCAL LEDGER
          </p>

          <h1 className="mt-3 font-editorial text-6xl tracking-[-0.05em] md:text-8xl">
            RUNS.
          </h1>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="font-mono text-[9px] tracking-[0.14em]"
        >
          ← BACK
        </button>
      </div>

      <section className="mt-8">
        {runs.length === 0 && (
          <div className="border border-rule p-10">
            <p className="font-editorial text-3xl">
              No completed simulations yet.
            </p>

            <button
              type="button"
              onClick={onNewRun}
              className="mt-7 bg-ink px-7 py-4 font-mono text-[9px] tracking-[0.14em] text-paper"
            >
              START FIRST RUN →
            </button>
          </div>
        )}

        {runs.map((run) => {
          const state = run.state

          return (
            <article
              key={run.id}
              className="grid gap-6 border-b border-rule py-7 md:grid-cols-[0.5fr_1fr_auto] md:items-center"
            >
              <div>
                <p className="font-mono text-[9px] tracking-[0.13em] text-muted">
                  {new Date(
                    run.timestamp,
                  ).toLocaleDateString("en-NG", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <p className="mt-2 font-mono text-xs">
                  SEED {state.seed}
                </p>
              </div>

              <div>
                <p className="font-editorial text-2xl">
                  {formatCompactNaira(
                    state.profile.monthlyIncome,
                  )}{" "}
                  / MONTH ·{" "}
                  {formatCompactNaira(
                    state.profile.annualRent,
                  )}{" "}
                  RENT
                </p>

                <p
                  className={`mt-2 font-mono text-[9px] tracking-[0.13em] ${
                    state.rentStatus === "covered"
                      ? "text-green"
                      : "text-red"
                  }`}
                >
                  {state.rentStatus === "covered"
                    ? "RENT COVERED"
                    : `${formatCompactNaira(
                        state.rentShortfall,
                      )} SHORT`}
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="font-mono text-2xl">
                  {state.score.toLocaleString()}
                </p>

                <p className="mt-1 font-mono text-[8px] tracking-[0.12em] text-muted">
                  {run.comparisons.length} COMPARISON
                  {run.comparisons.length === 1
                    ? ""
                    : "S"}
                </p>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}