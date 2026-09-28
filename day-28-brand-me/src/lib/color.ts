import type {
  BrandDNA,
  ColorStep,
  SemanticTheme,
  TonalScale,
} from "../types"

const STEPS: ColorStep[] = [
  50,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  950,
]

const LIGHTNESS: Record<ColorStep, number> = {
  50: 0.975,
  100: 0.945,
  200: 0.89,
  300: 0.82,
  400: 0.73,
  500: 0.64,
  600: 0.55,
  700: 0.46,
  800: 0.37,
  900: 0.29,
  950: 0.2,
}

export interface OKLCH {
  l: number
  c: number
  h: number
}

interface RGB {
  r: number
  g: number
  b: number
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function linearToSrgb(value: number) {
  return value <= 0.0031308
    ? 12.92 * value
    : 1.055 * value ** (1 / 2.4) - 0.055
}

function srgbToLinear(value: number) {
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4
}

function oklchToLinearRgb(color: OKLCH): RGB {
  const angle = (color.h * Math.PI) / 180

  const a = color.c * Math.cos(angle)
  const b = color.c * Math.sin(angle)

  const lPrime =
    color.l +
    0.3963377774 * a +
    0.2158037573 * b

  const mPrime =
    color.l -
    0.1055613458 * a -
    0.0638541728 * b

  const sPrime =
    color.l -
    0.0894841775 * a -
    1.291485548 * b

  const l = lPrime ** 3
  const m = mPrime ** 3
  const s = sPrime ** 3

  return {
    r:
      4.0767416621 * l -
      3.3077115913 * m +
      0.2309699292 * s,
    g:
      -1.2684380046 * l +
      2.6097574011 * m -
      0.3413193965 * s,
    b:
      -0.0041960863 * l -
      0.7034186147 * m +
      1.707614701 * s,
  }
}

function inGamut(rgb: RGB) {
  return (
    rgb.r >= 0 &&
    rgb.r <= 1 &&
    rgb.g >= 0 &&
    rgb.g <= 1 &&
    rgb.b >= 0 &&
    rgb.b <= 1
  )
}

export function gamutSafe(color: OKLCH): OKLCH {
  let current = { ...color }

  for (let i = 0; i < 30; i += 1) {
    if (inGamut(oklchToLinearRgb(current))) {
      return current
    }

    current = {
      ...current,
      c: current.c * 0.92,
    }
  }

  return {
    ...current,
    c: 0,
  }
}

export function oklchToHex(input: OKLCH) {
  const color = gamutSafe(input)
  const linear = oklchToLinearRgb(color)

  const rgb = {
    r: clamp(linearToSrgb(linear.r)),
    g: clamp(linearToSrgb(linear.g)),
    b: clamp(linearToSrgb(linear.b)),
  }

  const channel = (value: number) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, "0")

  return `#${channel(rgb.r)}${channel(rgb.g)}${channel(rgb.b)}`
}

export function hexToRgb(hex: string): RGB {
  const normalized = hex.replace("#", "").trim()

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error("Invalid 6-character hex color.")
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16) / 255,
    g: parseInt(normalized.slice(2, 4), 16) / 255,
    b: parseInt(normalized.slice(4, 6), 16) / 255,
  }
}

export function hexToOklch(hex: string): OKLCH {
  const rgb = hexToRgb(hex)

  const r = srgbToLinear(rgb.r)
  const g = srgbToLinear(rgb.g)
  const b = srgbToLinear(rgb.b)

  const l =
    0.4122214708 * r +
    0.5363325363 * g +
    0.0514459929 * b

  const m =
    0.2119034982 * r +
    0.6806995451 * g +
    0.1073969566 * b

  const s =
    0.0883024619 * r +
    0.2817188376 * g +
    0.6299787005 * b

  const lRoot = Math.cbrt(l)
  const mRoot = Math.cbrt(m)
  const sRoot = Math.cbrt(s)

  const lightness =
    0.2104542553 * lRoot +
    0.793617785 * mRoot -
    0.0040720468 * sRoot

  const a =
    1.9779984951 * lRoot -
    2.428592205 * mRoot +
    0.4505937099 * sRoot

  const labB =
    0.0259040371 * lRoot +
    0.7827717662 * mRoot -
    0.808675766 * sRoot

  const chroma = Math.sqrt(a * a + labB * labB)

  let hue = Math.atan2(labB, a) * (180 / Math.PI)

  if (hue < 0) {
    hue += 360
  }

  return {
    l: lightness,
    c: chroma,
    h: hue,
  }
}

function luminance(hex: string) {
  const rgb = hexToRgb(hex)

  const channel = (value: number) =>
    value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4

  return (
    0.2126 * channel(rgb.r) +
    0.7152 * channel(rgb.g) +
    0.0722 * channel(rgb.b)
  )
}

export function contrastRatio(a: string, b: string) {
  const first = luminance(a)
  const second = luminance(b)

  const light = Math.max(first, second)
  const dark = Math.min(first, second)

  return (light + 0.05) / (dark + 0.05)
}

export function bestForeground(background: string) {
  const candidates = [
    "#ffffff",
    "#fcfcfb",
    "#11110f",
    "#090a09",
  ]

  return candidates.sort(
    (a, b) =>
      contrastRatio(background, b) -
      contrastRatio(background, a),
  )[0]
}

export function makeScale(
  base: OKLCH,
  exactPrimary?: string,
): TonalScale {
  const result = {} as TonalScale

  for (const step of STEPS) {
    const distance = Math.abs(step - 500) / 500
    const chromaFactor = 1 - distance * 0.45

    result[step] = oklchToHex({
      l: LIGHTNESS[step],
      c: base.c * chromaFactor,
      h: base.h,
    })
  }

  if (exactPrimary) {
    result[600] = exactPrimary
  }

  return result
}

export function makeNeutralScale(
  hue: number,
  premium: number,
): TonalScale {
  const chroma =
    0.004 +
    premium * 0.008

  return makeScale({
    l: 0.6,
    c: chroma,
    h: hue,
  })
}

function semanticColor(
  hue: number,
  l = 0.56,
  c = 0.16,
) {
  return oklchToHex({
    l,
    c,
    h: hue,
  })
}

export function createTheme(
  primary: TonalScale,
  neutral: TonalScale,
  dna: BrandDNA,
  dark: boolean,
): SemanticTheme {
  const chosenPrimary = primary[600]
  const primaryForeground =
    bestForeground(chosenPrimary)

  if (dark) {
    return {
      background: neutral[950],
      surface: neutral[900],
      surfaceRaised: neutral[800],
      foreground: neutral[50],
      mutedForeground: neutral[300],
      border: neutral[800],
      input: neutral[800],
      primary: primary[400],
      primaryForeground:
        bestForeground(primary[400]),
      secondary: neutral[800],
      secondaryForeground: neutral[100],
      accent:
        dna.energy > 0.65
          ? primary[300]
          : primary[500],
      accentForeground:
        bestForeground(
          dna.energy > 0.65
            ? primary[300]
            : primary[500],
        ),
      success: semanticColor(145, 0.69, 0.13),
      successForeground: "#07120c",
      warning: semanticColor(80, 0.78, 0.14),
      warningForeground: "#181006",
      danger: semanticColor(26, 0.67, 0.18),
      dangerForeground: "#190804",
      focus: primary[300],
    }
  }

  return {
    background: neutral[50],
    surface: "#ffffff",
    surfaceRaised: neutral[100],
    foreground: neutral[950],
    mutedForeground: neutral[600],
    border: neutral[200],
    input: neutral[300],
    primary: chosenPrimary,
    primaryForeground,
    secondary: neutral[100],
    secondaryForeground: neutral[900],
    accent:
      dna.energy > 0.65
        ? primary[500]
        : primary[100],
    accentForeground:
      bestForeground(
        dna.energy > 0.65
          ? primary[500]
          : primary[100],
      ),
    success: semanticColor(145),
    successForeground: "#ffffff",
    warning: semanticColor(80, 0.69, 0.14),
    warningForeground: "#1d1304",
    danger: semanticColor(26),
    dangerForeground: "#ffffff",
    focus: primary[500],
  }
}