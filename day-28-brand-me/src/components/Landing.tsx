import {
  ArrowRight,
  ChevronDown,
  History,
  Sparkles,
} from "lucide-react"
import {
  useMemo,
  useState,
} from "react"
import type { BrandBrief } from "../types"

interface Props {
  onGenerate:
    (brief: BrandBrief) => void
  onHistory: () => void
}

const examples = [
  {
    label: "FINTECH",
    name: "Kora",
    description:
      "A premium financial product for African freelancers. Calm, modern and trustworthy without feeling corporate.",
  },
  {
    label: "DEVELOPER TOOL",
    name: "Relay",
    description:
      "A technical developer platform. Sharp, fast and focused, with strong clarity and minimal visual noise.",
  },
  {
    label: "CREATIVE STUDIO",
    name: "North",
    description:
      "An expressive creative studio. Editorial, confident, cultured and slightly unexpected.",
  },
  {
    label: "FASHION",
    name: "Ader",
    description:
      "A minimal high-end fashion brand. Quiet, editorial, contemporary and visually restrained.",
  },
]

export function Landing({
  onGenerate,
  onHistory,
}: Props) {
  const [name, setName] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [expanded, setExpanded] =
    useState(false)

  const [audience, setAudience] =
    useState("")

  const [productType, setProductType] =
    useState("")

  const [industry, setIndustry] =
    useState("")

  const [wordsToAvoid, setWordsToAvoid] =
    useState("")

  const [existingColor, setExistingColor] =
    useState("")

  const canSubmit = useMemo(
    () =>
      name.trim().length > 1 &&
      description.trim().length > 15,
    [name, description],
  )

  function submit() {
    if (!canSubmit) {
      return
    }

    onGenerate({
      name,
      description,
      audience,
      productType,
      industry,
      wordsToAvoid,
      existingColor,
    })
  }

  return (
    <main className="min-h-screen bg-[#f2f1ed] text-[#171714]">
      <header className="flex h-16 items-center justify-between border-b border-black/10 px-5 md:px-8">
        <div className="text-xs font-semibold tracking-[0.18em]">
          27 / 30
        </div>

        <div className="text-sm font-black tracking-[-0.03em]">
          BRAND ME
        </div>

        <button
          onClick={onHistory}
          className="flex items-center gap-2 text-xs font-semibold"
        >
          <History size={14} />
          MY BRANDS
        </button>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1500px] grid-cols-1 gap-10 px-5 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:py-16">
        <div className="flex flex-col justify-between">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-black/50">
              DESIGN SYSTEM GENERATOR
            </p>

            <h1 className="max-w-3xl text-[clamp(4rem,9vw,9.8rem)] font-black leading-[0.78] tracking-[-0.085em]">
              FROM
              <br />
              VIBE
              <br />
              TO
              <br />
              VARIABLES.
            </h1>
          </div>

          <div className="hidden max-w-sm border-l border-black/20 pl-4 text-sm leading-6 text-black/55 lg:block">
            AI interprets intent.
            <br />
            Code builds the system.
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full border border-black/15 bg-[#faf9f6] p-5 shadow-[0_24px_80px_rgba(20,20,15,0.07)] md:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold tracking-[0.14em] text-black/45">
                  DESCRIBE THE BRAND
                </div>

                <p className="mt-2 text-sm text-black/50">
                  Get color, type, tokens and
                  a live interface.
                </p>
              </div>

              <Sparkles
                size={18}
                className="text-black/35"
              />
            </div>

            <label className="block">
              <span className="text-[11px] font-bold tracking-[0.14em] text-black/45">
                BRAND NAME
              </span>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="KORA"
                className="mt-2 w-full border-0 border-b border-black/20 bg-transparent py-4 text-3xl font-semibold tracking-[-0.04em] outline-none placeholder:text-black/15"
              />
            </label>

            <label className="mt-8 block">
              <span className="text-[11px] font-bold tracking-[0.14em] text-black/45">
                DESCRIBE THE BRAND
              </span>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="A premium fintech product for African freelancers. Calm, modern and trustworthy without feeling corporate."
                rows={5}
                className="mt-3 w-full resize-none border border-black/15 bg-white p-4 text-base leading-7 outline-none transition focus:border-black/50"
              />
            </label>

            <button
              onClick={() =>
                setExpanded(!expanded)
              }
              className="mt-5 flex w-full items-center justify-between border-y border-black/10 py-4 text-xs font-bold tracking-[0.14em]"
            >
              MORE CONTEXT
              <ChevronDown
                size={15}
                className={
                  expanded
                    ? "rotate-180 transition"
                    : "transition"
                }
              />
            </button>

            {expanded && (
              <div className="grid grid-cols-1 gap-3 border-b border-black/10 py-5 md:grid-cols-2">
                <SmallInput
                  label="AUDIENCE"
                  value={audience}
                  onChange={setAudience}
                />

                <SmallInput
                  label="PRODUCT TYPE"
                  value={productType}
                  onChange={setProductType}
                />

                <SmallInput
                  label="INDUSTRY"
                  value={industry}
                  onChange={setIndustry}
                />

                <SmallInput
                  label="WORDS TO AVOID"
                  value={wordsToAvoid}
                  onChange={setWordsToAvoid}
                />

                <SmallInput
                  label="EXISTING COLOR"
                  value={existingColor}
                  onChange={setExistingColor}
                  placeholder="#1D4ED8"
                />
              </div>
            )}

            <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
              <button
                onClick={submit}
                disabled={!canSubmit}
                className="flex min-h-14 items-center justify-between bg-[#171714] px-5 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-25"
              >
                BRAND ME
                <ArrowRight size={17} />
              </button>

              <button
                onClick={() => {
                  const sample =
                    examples[
                      Math.floor(
                        Math.random() *
                          examples.length,
                      )
                    ]

                  setName(sample.name)
                  setDescription(
                    sample.description,
                  )
                }}
                className="min-h-14 border border-black/15 px-5 text-xs font-bold"
              >
                TRY AN EXAMPLE
              </button>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example.label}
                  onClick={() => {
                    setName(example.name)
                    setDescription(
                      example.description,
                    )
                  }}
                  className="border border-black/10 bg-white px-3 py-2 text-[10px] font-bold tracking-[0.1em] text-black/55 transition hover:border-black/35 hover:text-black"
                >
                  {example.label}
                </button>
              ))}
            </div>

            <div className="mt-7 text-[10px] font-bold tracking-[0.12em] text-black/35">
              ACCESSIBLE TOKENS · LIVE UI ·
              PRODUCTION EXPORT
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function SmallInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label>
      <span className="text-[10px] font-bold tracking-[0.12em] text-black/40">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-1.5 w-full border border-black/10 bg-white px-3 py-3 text-sm outline-none focus:border-black/40"
      />
    </label>
  )
}