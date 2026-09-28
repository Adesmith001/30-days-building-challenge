import {
  ArrowDown,
  X,
} from "lucide-react"

export function AboutModal({
  onClose,
}: {
  onClose: () => void
}) {
  const flow = [
    "BRIEF",
    "BRAND DNA",
    "SEEDED DESIGN ENGINE",
    "OKLCH COLOR",
    "FONT SCORING",
    "SEMANTIC TOKENS",
    "CONTRAST CHECKS",
    "LIVE UI",
    "EXPORT",
  ]

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#f1f0eb] text-[#181815]">
      <header className="sticky top-0 flex h-16 items-center justify-between border-b border-black/10 bg-[#f1f0eb]/95 px-5 backdrop-blur">
        <div className="text-xs font-black">
          HOW BRAND ME WORKS
        </div>

        <button
          onClick={onClose}
          className="editor-icon-button"
        >
          <X size={15} />
        </button>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-16">
        <div className="editor-eyebrow">
          ENGINE
        </div>

        <h2 className="editor-title">
          AI INTERPRETS.
          <br />
          CODE GENERATES.
        </h2>

        <p className="mt-8 max-w-xl text-base leading-7 text-black/50">
          The model never generates your final
          palette, typography configuration or
          production tokens. It interprets intent
          into structured Brand DNA. A deterministic
          engine produces everything else.
        </p>

        <div className="mt-16 max-w-2xl">
          {flow.map((item, index) => (
            <div key={item}>
              <div className="border border-black/15 bg-white p-5 text-sm font-black">
                {item}
              </div>

              {index <
                flow.length - 1 && (
                <div className="flex h-12 items-center justify-center">
                  <ArrowDown
                    size={16}
                    className="text-black/35"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <section className="mt-20 border-t border-black/10 pt-10">
          <div className="editor-eyebrow">
            REPRODUCIBILITY
          </div>

          <h3 className="mt-4 text-4xl font-black tracking-[-0.045em]">
            SAME DNA.
            <br />
            SAME SEED.
            <br />
            SAME SYSTEM.
          </h3>
        </section>

        <section className="mt-16 border-t border-black/10 pt-10">
          <div className="editor-eyebrow">
            PRIVACY
          </div>

          <div className="mt-5 divide-y divide-black/10 border-y border-black/10">
            <Fact
              name="BRAND PROJECTS"
              value="SAVED LOCALLY"
            />

            <Fact
              name="AI INTERPRETATION"
              value="SENT TO THE CONFIGURED MODEL PROVIDER WHEN ENABLED"
            />

            <Fact
              name="TOKEN GENERATION"
              value="RUNS DETERMINISTICALLY IN THE APP"
            />

            <Fact
              name="EXPORT"
              value="ONLY CREATED WHEN REQUESTED"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function Fact({
  name,
  value,
}: {
  name: string
  value: string
}) {
  return (
    <div className="grid gap-2 py-5 sm:grid-cols-[220px_1fr]">
      <div className="text-[10px] font-bold tracking-[0.1em]">
        {name}
      </div>

      <div className="text-sm text-black/50">
        {value}
      </div>
    </div>
  )
}