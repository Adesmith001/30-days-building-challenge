export type DNAKey =
  | "warmth"
  | "energy"
  | "formality"
  | "playfulness"
  | "boldness"
  | "premium"
  | "technical"
  | "editorial"
  | "density"

export interface BrandDNA {
  warmth: number
  energy: number
  formality: number
  playfulness: number
  boldness: number
  premium: number
  technical: number
  editorial: number
  density: number
}

export interface BrandBrief {
  name: string
  description: string
  audience?: string
  productType?: string
  industry?: string
  wordsToAvoid?: string
  existingColor?: string
  existingFont?: string
}

export interface Interpretation {
  summary: string
  keywords: string[]
  dna: BrandDNA
}

export interface FontProfile {
  family: string
  category:
    | "grotesk"
    | "humanist"
    | "geometric"
    | "serif"
    | "editorial"
    | "mono"
    | "display"
  weights: number[]
  warmth: number
  formality: number
  playfulness: number
  technical: number
  editorial: number
}

export interface FontChoice {
  family: string
  category: FontProfile["category"]
  weights: number[]
}

export type ColorStep =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950

export type TonalScale = Record<ColorStep, string>

export interface SemanticTheme {
  background: string
  surface: string
  surfaceRaised: string
  foreground: string
  mutedForeground: string
  border: string
  input: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  success: string
  successForeground: string
  warning: string
  warningForeground: string
  danger: string
  dangerForeground: string
  focus: string
}

export interface TypographySystem {
  heading: FontChoice
  body: FontChoice
  mono: FontChoice
  scale: Record<
    string,
    {
      size: number
      lineHeight: number
      weight: number
      tracking: number
    }
  >
}

export interface RadiusSystem {
  sm: number
  md: number
  lg: number
  xl: number
  full: number
}

export interface MotionSystem {
  fast: number
  normal: number
  slow: number
  standard: string
  emphasized: string
}

export interface BrandSystem {
  name: string
  seed: string
  generatorVersion: number
  dna: BrandDNA

  colors: {
    primary: TonalScale
    neutral: TonalScale
    light: SemanticTheme
    dark: SemanticTheme
  }

  typography: TypographySystem

  spacing: Record<string, number>
  radii: RadiusSystem

  borders: {
    subtle: string
    default: string
    strong: string
    focus: string
  }

  shadows: {
    sm: string
    md: string
    lg: string
  }

  motion: MotionSystem

  wordmark: {
    case: "uppercase" | "title" | "lowercase"
    tracking: number
    weight: number
  }
}

export interface BrandLocks {
  primary?: string
  headingFont?: string
  bodyFont?: string
  radii?: RadiusSystem
}

export interface BrandOverrides {
  primaryColor?: string
  headingFont?: string
  bodyFont?: string
}

export interface VariantSnapshot {
  id: string
  label: string
  seed: string
  dna: BrandDNA
  locks: BrandLocks
  overrides: BrandOverrides
}

export interface BrandProject {
  id: string
  name: string
  brief: BrandBrief
  summary: string
  keywords: string[]
  dna: BrandDNA
  seed: string
  generatorVersion: number
  locks: BrandLocks
  overrides: BrandOverrides
  variants: VariantSnapshot[]
  createdAt: number
  updatedAt: number
}

export type WorkspaceView =
  | "preview"
  | "palette"
  | "type"
  | "components"
  | "tokens"
  | "stress"
  | "export"

export type PreviewMode =
  | "landing"
  | "product"
  | "dashboard"
  | "mobile"