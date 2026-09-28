import {
  Check,
  Circle,
} from "lucide-react"
import {
  useEffect,
  useState,
} from "react"
import { motion } from "motion/react"
import type {
  BrandBrief,
  Interpretation,
} from "../types"
import {
  interpretBrand,
} from "../lib/interpret"

const stages = [
  "UNDERSTANDING BRIEF",
  "MAPPING BRAND DNA",
  "BUILDING COLOR SYSTEM",
  "PAIRING TYPE",
  "TESTING CONTRAST",
  "APPLYING SYSTEM",
]

interface Props {
  brief: BrandBrief

  onReady: (
    result: Interpretation,
    source: "ai" | "local",
  ) => void
}

export function Generating({
  brief,
  onReady,
}: Props) {
  const [active, setActive] =
    useState(0)

  const [interpretation, setInterpretation] =
    useState<{
      result: Interpretation
      source: "ai" | "local"
    } | null>(null)

  useEffect(() => {
    let alive = true

    interpretBrand(brief).then((result) => {
      if (alive) {
        setInterpretation(result)
      }
    })

    return () => {
      alive = false
    }
  }, [brief])

  useEffect(() => {
    if (active >= stages.length - 1) {
      return
    }

    const timeout = window.setTimeout(
      () => setActive(active + 1),
      520,
    )

    return () =>
      window.clearTimeout(timeout)
  }, [active])

  useEffect(() => {
    if (
      active !== stages.length - 1 ||
      !interpretation
    ) {
      return
    }

    const timeout = window.setTimeout(() => {
      onReady(
        interpretation.result,
        interpretation.source,
      )
    }, 700)

    return () =>
      window.clearTimeout(timeout)
  }, [
    active,
    interpretation,
    onReady,
  ])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f1ed] p-5 text-[#171714]">
      <div className="w-full max-w-5xl">
        <div className="mb-20 flex items-center justify-between border-b border-black/10 pb-5">
          <span className="text-xs font-bold tracking-[0.16em]">
            27 / 30
          </span>

          <span className="text-xs font-black">
            BRAND ME
          </span>

          <span className="text-xs text-black/40">
            {String(active + 1).padStart(2, "0")}
            {" / "}
            06
          </span>
        </div>

        <div className="grid gap-14 md:grid-cols-[1fr_340px]">
          <div>
            <motion.div
              key={active}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.83] tracking-[-0.07em]"
            >
              {stages[active]
                .split(" ")
                .map((word) => (
                  <div key={word}>
                    {word}.
                  </div>
                ))}
            </motion.div>

            <div className="mt-12">
              <div className="text-xs font-bold tracking-[0.16em] text-black/35">
                {brief.name.toUpperCase()}
              </div>

              {interpretation && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {interpretation.result.keywords
                    .slice(0, 4)
                    .map((word) => (
                      <motion.span
                        initial={{
                          opacity: 0,
                          scale: 0.95,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        key={word}
                        className="border border-black/15 bg-white px-3 py-2 text-[10px] font-bold tracking-[0.1em]"
                      >
                        {word.toUpperCase()}
                      </motion.span>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            {stages.map((stage, index) => {
              const complete = index < active
              const current = index === active

              return (
                <div
                  key={stage}
                  className="flex min-h-14 items-center justify-between border-b border-black/10"
                >
                  <span
                    className={
                      current
                        ? "text-xs font-bold"
                        : "text-xs text-black/35"
                    }
                  >
                    {stage}
                  </span>

                  {complete ? (
                    <Check size={15} />
                  ) : (
                    <Circle
                      size={12}
                      className={
                        current
                          ? "fill-black"
                          : "text-black/20"
                      }
                    />
                  )}
                </div>
              )
            })}

            <div className="pt-6 text-[10px] font-bold tracking-[0.12em] text-black/35">
              NO FAKE PERCENTAGES.
              <br />
              EACH STEP BUILDS THE SYSTEM.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}