interface Props {
  onBack: () => void
}

export function AboutScreen({
  onBack,
}: Props) {
  return (
    <main className="mx-auto max-w-[900px] px-5 py-12 md:px-12 md:py-20">
      <button
        type="button"
        onClick={onBack}
        className="font-mono text-[9px] tracking-[0.14em] text-muted"
      >
        ← RETURN
      </button>

      <p className="mt-14 font-mono text-[9px] tracking-[0.15em] text-muted">
        SIMULATION DISCLAIMER
      </p>

      <h1 className="mt-4 font-editorial text-6xl tracking-[-0.05em] md:text-8xl">
        ABOUT THE
        <br />
        <em>MODEL.</em>
      </h1>

      <div className="mt-12 max-w-2xl space-y-6 font-body text-lg leading-8 text-graphite">
        <p>
          Rent Is Lava is a fictional budgeting
          simulation for exploration and entertainment.
          It does not provide financial advice.
        </p>

        <p>
          Survival Score and Stability are simulation
          metrics. They are not financial-health,
          credit, lending, or affordability
          assessments.
        </p>

        <p>
          No bank connection is required. You can use
          real or completely fictional numbers.
        </p>

        <p>
          Seeded events exist so that changing one
          variable can replay the same simulated year
          against different numbers.
        </p>
      </div>

      <div className="mt-14 border-t border-rule pt-6 font-mono text-[9px] tracking-[0.14em] text-muted">
        DAY 15 / 30 · RENT IS LAVA
      </div>
    </main>
  )
}