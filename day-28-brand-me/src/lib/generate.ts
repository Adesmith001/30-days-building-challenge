import { fonts } from "../data/fonts"
import type {
  BrandDNA,
  BrandProject,
  BrandSystem,
  FontProfile,
  TypographySystem,
} from "../types"
import {
  createTheme,
  hexToOklch,
  makeNeutralScale,
  makeScale,
} from "./color"
import { seededRandom } from "./seed"

const GENERATOR_VERSION = 1

function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

function scoreFont(
  font: FontProfile,
  dna: BrandDNA,
  heading: boolean,
) {
  const dimensions = [
    Math.abs(font.warmth - dna.warmth),
    Math.abs(font.formality - dna.formality),
    Math.abs(font.playfulness - dna.playfulness),
    Math.abs(font.technical - dna.technical),
    Math.abs(font.editorial - dna.editorial),
  ]

  let score =
    1 -
    dimensions.reduce((sum, value) => sum + value, 0) /
      dimensions.length

  if (
    heading &&
    dna.editorial > 0.68 &&
    ["serif", "editorial"].includes(font.category)
  ) {
    score += 0.18
  }

  if (
    dna.technical > 0.75 &&
    ["grotesk", "mono"].includes(font.category)
  ) {
    score += 0.12
  }

  return score
}

function chooseTypography(
  project: BrandProject,
): TypographySystem {
  const random = seededRandom(
    `${project.seed}:typography`,
  )

  const ranked = fonts
    .filter((font) => font.category !== "mono")
    .map((font) => ({
      font,
      score:
        scoreFont(font, project.dna, true) +
        random() * 0.035,
    }))
    .sort((a, b) => b.score - a.score)

  const headingFamily =
    project.locks.headingFont ??
    project.overrides.headingFont ??
    ranked[0].font.family

  const heading =
    fonts.find(
      (font) => font.family === headingFamily,
    ) ?? ranked[0].font

  const bodyCandidates = fonts
    .filter(
      (font) =>
        font.category !== "mono" &&
        font.family !== heading.family,
    )
    .map((font) => ({
      font,
      score:
        scoreFont(font, project.dna, false) +
        random() * 0.025,
    }))
    .sort((a, b) => b.score - a.score)

  const bodyFamily =
    project.locks.bodyFont ??
    project.overrides.bodyFont ??
    bodyCandidates[0].font.family

  const body =
    fonts.find(
      (font) => font.family === bodyFamily,
    ) ?? bodyCandidates[0].font

  const mono =
    fonts.find(
      (font) => font.category === "mono",
    )!

  const ratio =
    1.16 +
    project.dna.boldness * 0.12 +
    project.dna.editorial * 0.06

  const bodySize =
    15.5 -
    project.dna.density * 0.8

  const size = (steps: number) =>
    Number(
      (
        bodySize *
        ratio ** steps
      ).toFixed(2),
    )

  return {
    heading,
    body,
    mono,
    scale: {
      display: {
        size: Math.min(72, size(7)),
        lineHeight: 0.96,
        weight:
          project.dna.boldness > 0.6 ? 700 : 600,
        tracking: -0.045,
      },
      h1: {
        size: size(5),
        lineHeight: 1,
        weight: 650,
        tracking: -0.035,
      },
      h2: {
        size: size(4),
        lineHeight: 1.08,
        weight: 620,
        tracking: -0.025,
      },
      h3: {
        size: size(3),
        lineHeight: 1.12,
        weight: 600,
        tracking: -0.018,
      },
      bodyLg: {
        size: size(1),
        lineHeight: 1.55,
        weight: 400,
        tracking: -0.005,
      },
      body: {
        size: bodySize,
        lineHeight: 1.55,
        weight: 400,
        tracking: 0,
      },
      bodySm: {
        size: bodySize * 0.88,
        lineHeight: 1.5,
        weight: 400,
        tracking: 0,
      },
      caption: {
        size: 11.5,
        lineHeight: 1.4,
        weight: 550,
        tracking: 0.04,
      },
    },
  }
}

function baseHue(
  project: BrandProject,
) {
  const random = seededRandom(
    `${project.seed}:color`,
  )

  let hue = random() * 360

  hue +=
    (project.dna.warmth - 0.5) * 75

  hue +=
    (project.dna.playfulness - 0.5) * 18

  return ((hue % 360) + 360) % 360
}

export function generateBrandSystem(
  project: BrandProject,
): BrandSystem {
  const forcedPrimary =
    project.locks.primary ??
    project.overrides.primaryColor

  const forcedOklch = forcedPrimary
    ? hexToOklch(forcedPrimary)
    : undefined

  const hue =
    forcedOklch?.h ??
    baseHue(project)

  const chroma =
    forcedOklch?.c ??
    clamp(
      0.095 +
        project.dna.energy * 0.055 +
        project.dna.boldness * 0.055 -
        project.dna.premium * 0.025,
    )

  const primary = makeScale(
    {
      l: forcedOklch?.l ?? 0.57,
      c: chroma,
      h: hue,
    },
    forcedPrimary,
  )

  const neutral = makeNeutralScale(
    hue,
    project.dna.premium,
  )

  const light = createTheme(
    primary,
    neutral,
    project.dna,
    false,
  )

  const dark = createTheme(
    primary,
    neutral,
    project.dna,
    true,
  )

  const typography = chooseTypography(project)

  const spacingMultiplier =
    1.08 -
    project.dna.density * 0.22

  const spacing = {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    6: Math.round(24 * spacingMultiplier),
    8: Math.round(32 * spacingMultiplier),
    12: Math.round(48 * spacingMultiplier),
    16: Math.round(64 * spacingMultiplier),
  }

  const radiusBase =
    3 +
    project.dna.playfulness * 11 -
    project.dna.technical * 2

  const generatedRadii = {
    sm: Math.max(2, Math.round(radiusBase * 0.55)),
    md: Math.max(4, Math.round(radiusBase)),
    lg: Math.max(6, Math.round(radiusBase * 1.55)),
    xl: Math.max(8, Math.round(radiusBase * 2.3)),
    full: 999,
  }

  const radii =
    project.locks.radii ??
    generatedRadii

  const shadowOpacity =
    0.05 +
    project.dna.premium * 0.04 -
    project.dna.technical * 0.025

  const shadowAlpha =
    shadowOpacity.toFixed(3)

  const energy = project.dna.energy

  return {
    name: project.name,
    seed: project.seed,
    generatorVersion: GENERATOR_VERSION,
    dna: project.dna,

    colors: {
      primary,
      neutral,
      light,
      dark,
    },

    typography,

    spacing,
    radii,

    borders: {
      subtle: `1px solid ${neutral[100]}`,
      default: `1px solid ${neutral[200]}`,
      strong: `1px solid ${neutral[400]}`,
      focus: `2px solid ${primary[500]}`,
    },

    shadows: {
      sm:
        `0 1px 2px rgba(20,20,18,${shadowAlpha})`,
      md:
        `0 8px 24px rgba(20,20,18,${(
          shadowOpacity * 1.3
        ).toFixed(3)})`,
      lg:
        `0 24px 70px rgba(20,20,18,${(
          shadowOpacity * 1.6
        ).toFixed(3)})`,
    },

    motion: {
      fast: Math.round(150 - energy * 35),
      normal: Math.round(240 - energy * 55),
      slow: Math.round(360 - energy * 70),
      standard: "cubic-bezier(.2,.8,.2,1)",
      emphasized: "cubic-bezier(.16,1,.3,1)",
    },

    wordmark: {
      case:
        project.dna.formality > 0.72
          ? "uppercase"
          : project.dna.playfulness > 0.68
            ? "lowercase"
            : "title",
      tracking:
        project.dna.formality > 0.68
          ? 0.075
          : -0.025,
      weight:
        project.dna.boldness > 0.62
          ? 700
          : 600,
    },
  }
}