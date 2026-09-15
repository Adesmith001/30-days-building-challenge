import { ArrowRight } from "lucide-react"

import { formatNaira } from "../lib/currency"
import { getScoreLabel } from "../lib/scoring"

interface Props {
  personalBest: number
  onStart: () => void
  onHistory: () => void
}

export function HomeScreen({
  personalBest,
  onStart,
  onHistory,
}: Props) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1200px] flex-col px-5 py-12 md:px-12 md:py-20">
      <div className="flex justify-between border-b border-rule pb-4 font-mono text-[9px] tracking-[0.15em] text-muted">
        <span>CYCLE: 01 / 12</span>

        <span className="text-orange">
          ■ RENT IS WAITING
        </span>

        <button
          type="button"
          onClick={onHistory}
          className="hover:text-ink"
        >
          RUN INDEX
        </button>
      </div>

      <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1fr_0.35fr]">
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-rule px-3 py-2 font-mono text-[9px] tracking-[0.13em]">
              12-MONTH MONEY SIMULATOR
            </span>

            <span className="font-mono text-[9px] tracking-[0.13em] text-muted">
              [SEEDED EVENT ENGINE]
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl font-editorial text-6xl leading-[0.9] tracking-[-0.055em] md:text-[88px]">
            YOUR SALARY
            <br />
            JUST LANDED.
            <br />

            <em className="text-muted">
              RENT IS WAITING.
            </em>
          </h1>

          <p className="mt-10 font-editorial text-xl">
            Build a 12-month plan. Then see if it
            survives real life.
          </p>

          <button
            type="button"
            onClick={onStart}
            className="mt-10 flex items-center gap-10 bg-ink px-8 py-5 font-mono text-[10px] tracking-[0.14em] text-paper transition-opacity hover:opacity-80"
          >
            START A RENT RUN
            <ArrowRight size={15} />
          </button>

          <p className="mt-4 font-mono text-[9px] tracking-[0.12em] text-muted">
            12 MONTHS · SEEDED EVENTS · NO BANK CONNECTION
          </p>
        </section>

        <aside className="border-l border-rule pl-7">
          <p className="font-mono text-[9px] tracking-[0.14em] text-muted">
            RUN BASELINE
          </p>

          <p className="mt-3 font-editorial text-3xl">
            {formatNaira(450_000)}
          </p>

          <p className="mt-1 font-editorial text-sm text-graphite">
            Fictional example monthly take-home.
          </p>

          <div className="my-8 border-t border-rule" />

          <p className="font-mono text-[9px] tracking-[0.14em] text-muted">
            MODEL
          </p>

          <p className="mt-2 font-mono text-xs text-orange">
            DETERMINISTIC YEAR
          </p>
        </aside>
      </div>

      {personalBest > 0 && (
        <section className="flex flex-col justify-between gap-8 border border-rule bg-paper-soft p-7 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[9px] tracking-[0.14em] text-muted">
              PERSONAL BEST
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-5">
              <p className="font-editorial text-5xl">
                {personalBest.toLocaleString()}
              </p>

              <span className="border border-green px-3 py-1 font-mono text-[8px] tracking-[0.12em] text-green">
                {getScoreLabel(personalBest)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="border border-ink px-6 py-4 font-mono text-[10px] tracking-[0.14em] hover:bg-ink hover:text-paper"
          >
            BEAT MY RUN →
          </button>
        </section>
      )}
    </main>
  )
}