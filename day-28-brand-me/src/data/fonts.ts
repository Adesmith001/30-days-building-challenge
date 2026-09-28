import type { FontProfile } from "../types"

export const fonts: FontProfile[] = [
  {
    family: "Inter",
    category: "grotesk",
    weights: [400, 500, 600, 700],
    warmth: 0.38,
    formality: 0.62,
    playfulness: 0.2,
    technical: 0.75,
    editorial: 0.25,
  },
  {
    family: "Manrope",
    category: "geometric",
    weights: [400, 500, 600, 700, 800],
    warmth: 0.46,
    formality: 0.55,
    playfulness: 0.34,
    technical: 0.64,
    editorial: 0.38,
  },
  {
    family: "DM Sans",
    category: "humanist",
    weights: [400, 500, 600, 700],
    warmth: 0.58,
    formality: 0.46,
    playfulness: 0.45,
    technical: 0.4,
    editorial: 0.42,
  },
  {
    family: "Space Grotesk",
    category: "grotesk",
    weights: [400, 500, 600, 700],
    warmth: 0.32,
    formality: 0.52,
    playfulness: 0.45,
    technical: 0.84,
    editorial: 0.48,
  },
  {
    family: "IBM Plex Sans",
    category: "humanist",
    weights: [400, 500, 600, 700],
    warmth: 0.42,
    formality: 0.7,
    playfulness: 0.2,
    technical: 0.88,
    editorial: 0.36,
  },
  {
    family: "Plus Jakarta Sans",
    category: "geometric",
    weights: [400, 500, 600, 700, 800],
    warmth: 0.62,
    formality: 0.48,
    playfulness: 0.52,
    technical: 0.42,
    editorial: 0.38,
  },
  {
    family: "Sora",
    category: "geometric",
    weights: [400, 500, 600, 700],
    warmth: 0.35,
    formality: 0.55,
    playfulness: 0.4,
    technical: 0.74,
    editorial: 0.38,
  },
  {
    family: "Instrument Serif",
    category: "editorial",
    weights: [400],
    warmth: 0.7,
    formality: 0.82,
    playfulness: 0.4,
    technical: 0.12,
    editorial: 0.98,
  },
  {
    family: "Fraunces",
    category: "serif",
    weights: [400, 500, 600, 700],
    warmth: 0.78,
    formality: 0.72,
    playfulness: 0.65,
    technical: 0.08,
    editorial: 0.94,
  },
  {
    family: "Libre Baskerville",
    category: "serif",
    weights: [400, 700],
    warmth: 0.7,
    formality: 0.9,
    playfulness: 0.16,
    technical: 0.05,
    editorial: 0.9,
  },
  {
    family: "JetBrains Mono",
    category: "mono",
    weights: [400, 500, 600, 700],
    warmth: 0.2,
    formality: 0.56,
    playfulness: 0.18,
    technical: 1,
    editorial: 0.28,
  },
]

export function googleFontUrl(
  family: string,
  weights: number[],
) {
  const encoded = family.replace(/ /g, "+")

  const weightList = [...new Set(weights)]
    .sort((a, b) => a - b)
    .join(";")

  return (
    "https://fonts.googleapis.com/css2" +
    `?family=${encoded}:wght@${weightList}` +
    "&display=swap"
  )
}

export function loadFont(
  family: string,
  weights: number[],
) {
  if (typeof document === "undefined") {
    return
  }

  const id = `brandme-font-${family
    .toLowerCase()
    .replace(/\s+/g, "-")}`

  if (document.getElementById(id)) {
    return
  }

  const link = document.createElement("link")

  link.id = id
  link.rel = "stylesheet"
  link.href = googleFontUrl(family, weights)

  document.head.appendChild(link)
}