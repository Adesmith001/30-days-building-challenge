import { z } from "zod"
import type {
  BrandBrief,
  BrandDNA,
  Interpretation,
} from "../types"

const dnaSchema = z.object({
  warmth: z.number().min(0).max(1),
  energy: z.number().min(0).max(1),
  formality: z.number().min(0).max(1),
  playfulness: z.number().min(0).max(1),
  boldness: z.number().min(0).max(1),
  premium: z.number().min(0).max(1),
  technical: z.number().min(0).max(1),
  editorial: z.number().min(0).max(1),
  density: z.number().min(0).max(1),
})

const responseSchema = z.object({
  summary: z.string(),
  keywords: z.array(z.string()).max(8),
  dna: dnaSchema,
})

const defaults: BrandDNA = {
  warmth: 0.5,
  energy: 0.4,
  formality: 0.56,
  playfulness: 0.34,
  boldness: 0.5,
  premium: 0.58,
  technical: 0.5,
  editorial: 0.42,
  density: 0.42,
}

interface KeywordSignal {
  words: string[]
  key: keyof BrandDNA
  direction: number
}

const signals: KeywordSignal[] = [
  {
    words: ["warm", "friendly", "human", "welcoming"],
    key: "warmth",
    direction: 1,
  },
  {
    words: ["cool", "clinical", "precise"],
    key: "warmth",
    direction: -1,
  },
  {
    words: ["energetic", "fast", "lively", "dynamic"],
    key: "energy",
    direction: 1,
  },
  {
    words: ["calm", "quiet", "restrained"],
    key: "energy",
    direction: -1,
  },
  {
    words: ["formal", "professional", "institutional"],
    key: "formality",
    direction: 1,
  },
  {
    words: ["casual", "relaxed", "informal"],
    key: "formality",
    direction: -1,
  },
  {
    words: ["playful", "fun", "joyful", "quirky"],
    key: "playfulness",
    direction: 1,
  },
  {
    words: ["serious", "mature"],
    key: "playfulness",
    direction: -1,
  },
  {
    words: ["bold", "confident", "strong"],
    key: "boldness",
    direction: 1,
  },
  {
    words: ["subtle", "soft", "understated"],
    key: "boldness",
    direction: -1,
  },
  {
    words: ["premium", "luxury", "high-end"],
    key: "premium",
    direction: 1,
  },
  {
    words: ["accessible", "mass-market"],
    key: "premium",
    direction: -1,
  },
  {
    words: ["technical", "developer", "engineering"],
    key: "technical",
    direction: 1,
  },
  {
    words: ["human", "organic"],
    key: "technical",
    direction: -1,
  },
  {
    words: ["editorial", "fashion", "magazine"],
    key: "editorial",
    direction: 1,
  },
  {
    words: ["utilitarian", "functional"],
    key: "editorial",
    direction: -1,
  },
  {
    words: ["dense", "compact", "data-heavy"],
    key: "density",
    direction: 1,
  },
  {
    words: ["spacious", "airy", "minimal"],
    key: "density",
    direction: -1,
  },
]

function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

export function localInterpret(
  brief: BrandBrief,
): Interpretation {
  const text = [
    brief.description,
    brief.audience,
    brief.productType,
    brief.industry,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  const dna = { ...defaults }

  const found = new Set<string>()

  for (const signal of signals) {
    for (const word of signal.words) {
      if (!text.includes(word)) {
        continue
      }

      found.add(word)

      dna[signal.key] = clamp(
        dna[signal.key] +
          0.16 * signal.direction,
      )
    }
  }

  if (text.includes("trust")) {
    dna.formality = clamp(dna.formality + 0.08)
    dna.energy = clamp(dna.energy - 0.08)
    found.add("trustworthy")
  }

  if (text.includes("modern")) {
    dna.technical = clamp(dna.technical + 0.05)
    found.add("modern")
  }

  const keywords = [...found].slice(0, 6)

  if (keywords.length < 3) {
    keywords.push("considered")
  }

  return {
    summary:
      `A ${keywords.slice(0, 3).join(", ")} ` +
      `direction for ${brief.name}.`,
    keywords,
    dna,
  }
}

export async function interpretBrand(
  brief: BrandBrief,
) {
  try {
    const response = await fetch("/api/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(brief),
    })

    if (!response.ok) {
      throw new Error("Interpreter unavailable")
    }

    const result = responseSchema.parse(
      await response.json(),
    )

    return {
      result,
      source: "ai" as const,
    }
  } catch {
    return {
      result: localInterpret(brief),
      source: "local" as const,
    }
  }
}