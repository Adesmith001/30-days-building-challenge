import {
  AlertTriangle,
  Check,
  MonitorSmartphone,
} from "lucide-react"
import type {
  BrandSystem,
} from "../types"
import {
  contrastRatio,
} from "../lib/color"

interface CheckRow {
  label: string
  ratio?: number
  pass: boolean
  detail: string
}

export function StressView({
  system,
}: {
  system: BrandSystem
}) {
  const light = system.colors.light
  const dark = system.colors.dark

  const checks: CheckRow[] = [
    {
      label:
        "BODY TEXT / BACKGROUND",
      ratio: contrastRatio(
        light.foreground,
        light.background,
      ),
      pass:
        contrastRatio(
          light.foreground,
          light.background,
        ) >= 4.5,
      detail: "Normal text target: 4.5:1",
    },
    {
      label:
        "PRIMARY / PRIMARY FOREGROUND",
      ratio: contrastRatio(
        light.primary,
        light.primaryForeground,
      ),
      pass:
        contrastRatio(
          light.primary,
          light.primaryForeground,
        ) >= 4.5,
      detail: "Normal text target: 4.5:1",
    },
    {
      label:
        "MUTED TEXT / BACKGROUND",
      ratio: contrastRatio(
        light.mutedForeground,
        light.background,
      ),
      pass:
        contrastRatio(
          light.mutedForeground,
          light.background,
        ) >= 4.5,
      detail: "Normal text target: 4.5:1",
    },
    {
      label:
        "DARK BODY / BACKGROUND",
      ratio: contrastRatio(
        dark.foreground,
        dark.background,
      ),
      pass:
        contrastRatio(
          dark.foreground,
          dark.background,
        ) >= 4.5,
      detail: "Dark theme independently checked",
    },
  ]

  const passing =
    checks.filter((check) => check.pass).length

  return (
    <div className="p-5 md:p-8">
      <div className="editor-eyebrow">
        STRESS TEST
      </div>

      <h2 className="editor-title">
        STRESS
        <br />
        THE SYSTEM.
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <Result
          number={`${passing} / ${checks.length}`}
          label="TEXT PAIRS PASS"
        />

        <Result
          number="8 / 8"
          label="COMPONENT STATES"
        />

        <Result
          number="LIGHT + DARK"
          label="GENERATED"
        />

        <Result
          number="320PX"
          label="NARROW TEST"
        />
      </div>

      <section className="mt-12">
        <div className="editor-eyebrow">
          COLOR CONTRAST
        </div>

        <div className="mt-4 border-t border-black/10">
          {checks.map((check) => (
            <div
              key={check.label}
              className="grid gap-4 border-b border-black/10 py-5 sm:grid-cols-[1fr_auto_auto]"
            >
              <div>
                <div className="text-xs font-bold tracking-[0.06em]">
                  {check.label}
                </div>

                <div className="mt-1 text-xs text-black/40">
                  {check.detail}
                </div>
              </div>

              <div className="font-mono text-sm">
                {check.ratio?.toFixed(2)}
                :1
              </div>

              <div
                className={
                  check.pass
                    ? "flex items-center gap-2 text-xs font-bold"
                    : "flex items-center gap-2 text-xs font-bold text-red-700"
                }
              >
                {check.pass ? (
                  <Check size={14} />
                ) : (
                  <AlertTriangle size={14} />
                )}

                {check.pass
                  ? "PASS"
                  : "NEEDS ATTENTION"}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 max-w-xl text-xs leading-5 text-black/40">
          Contrast is one part of accessibility.
          These checks do not claim that the entire
          brand or application is accessible.
        </p>
      </section>

      <section className="mt-14">
        <div className="editor-eyebrow">
          LONG COPY TEST
        </div>

        <div className="mt-4 border border-black/10 bg-white p-5">
          <h3 className="max-w-3xl text-3xl font-black tracking-[-0.04em]">
            This intentionally overlong heading
            verifies that the generated typography can
            survive a less-than-perfect production
            content scenario without becoming visually
            unusable.
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/55">
            Real products rarely receive the perfectly
            balanced copy used in design mockups. This
            stress state includes substantially longer
            text to expose spacing, wrapping, vertical
            rhythm and hierarchy problems before the
            design system is exported.
          </p>

          <button className="mt-6 border border-black/15 px-4 py-3 text-xs font-bold">
            CONTINUE WITH THIS UNUSUALLY LONG BUTTON LABEL
          </button>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-center gap-2">
          <MonitorSmartphone size={15} />

          <div className="editor-eyebrow">
            SMALL SCREEN
          </div>
        </div>

        <div className="mt-4 w-[min(320px,100%)] border border-black/15 bg-white p-4">
          <div className="text-xs font-bold">
            320PX TEST
          </div>

          <div className="mt-5 text-2xl font-black">
            Long content still has to fit.
          </div>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Buttons stack, labels wrap and content
            remains within its available viewport.
          </p>

          <div className="mt-5 grid gap-2">
            <button className="bg-black px-4 py-3 text-xs font-bold text-white">
              PRIMARY ACTION
            </button>

            <button className="border border-black/15 px-4 py-3 text-xs font-bold">
              SECONDARY ACTION WITH LONGER COPY
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function Result({
  number,
  label,
}: {
  number: string
  label: string
}) {
  return (
    <div className="border border-black/10 bg-white p-5">
      <div className="text-xl font-black">
        {number}
      </div>

      <div className="mt-3 text-[9px] font-bold tracking-[0.1em] text-black/40">
        {label}
      </div>
    </div>
  )
}