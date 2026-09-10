interface Props {
  onStart: () => void;
}

export function HomeScreen({
  onStart,
}: Props) {
  return (
    <main className="flex min-h-[calc(100vh-44px)] flex-col px-5">
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="flex items-center gap-2 border border-line bg-panel px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-muted">
          <span className="size-1.5 bg-accent" />

          SCREENSHOT → DESIGN SYSTEM
        </div>

        <h1 className="mt-7 max-w-2xl font-sans text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-ink sm:text-[58px]">
          SEE THE SYSTEM
          <br />
          BEHIND THE UI.
        </h1>

        <p className="mt-6 max-w-lg font-sans text-sm leading-6 text-muted">
          Drop in a screenshot. UI X-Ray
          extracts the visual rules,
          reusable patterns and design
          tokens hiding inside it.
        </p>

        <button
          onClick={onStart}
          className="mt-8 bg-ink px-6 py-3 font-mono text-[11px] font-semibold text-white hover:bg-accent"
        >
          X-RAY A SCREENSHOT →
        </button>

        <div className="mt-3 font-mono text-[9px] tracking-[0.08em] text-ghost">
          COLORS · TYPE · SPACING ·
          COMPONENTS · TOKENS
        </div>
      </section>

      <div className="mx-auto mb-8 grid w-full max-w-3xl grid-cols-5 border border-line bg-panel">
        {[
          "UPLOAD",
          "ANALYZE",
          "MAP",
          "INSPECT",
          "EXPORT",
        ].map((item, index) => (
          <div
            key={item}
            className="border-r border-line p-3 text-center last:border-r-0"
          >
            <div className="font-mono text-[8px] text-ghost">
              0{index + 1}
            </div>

            <div className="mt-1 font-mono text-[8px] font-semibold">
              {item}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}