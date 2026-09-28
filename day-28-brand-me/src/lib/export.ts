import JSZip from "jszip"
import type {
  BrandProject,
  BrandSystem,
  SemanticTheme,
} from "../types"
import { contrastRatio } from "./color"

function themeCSS(
  theme: SemanticTheme,
) {
  return [
    `  --color-background: ${theme.background};`,
    `  --color-surface: ${theme.surface};`,
    `  --color-foreground: ${theme.foreground};`,
    `  --color-muted: ${theme.mutedForeground};`,
    `  --color-border: ${theme.border};`,
    `  --color-primary: ${theme.primary};`,
    `  --color-primary-foreground: ${theme.primaryForeground};`,
    `  --color-secondary: ${theme.secondary};`,
    `  --color-accent: ${theme.accent};`,
    `  --color-success: ${theme.success};`,
    `  --color-warning: ${theme.warning};`,
    `  --color-danger: ${theme.danger};`,
  ].join("\n")
}

export function exportCSS(system: BrandSystem) {
  return `:root {
${themeCSS(system.colors.light)}

  --font-heading: "${system.typography.heading.family}", sans-serif;
  --font-body: "${system.typography.body.family}", sans-serif;
  --radius-sm: ${system.radii.sm}px;
  --radius-md: ${system.radii.md}px;
  --radius-lg: ${system.radii.lg}px;
  --radius-xl: ${system.radii.xl}px;
  --motion-fast: ${system.motion.fast}ms;
  --motion-normal: ${system.motion.normal}ms;
  --motion-slow: ${system.motion.slow}ms;
}

.dark {
${themeCSS(system.colors.dark)}
}`
}

export function exportTailwind(
  system: BrandSystem,
) {
  return `@theme {
  --color-brand-background: ${system.colors.light.background};
  --color-brand-foreground: ${system.colors.light.foreground};
  --color-brand-primary: ${system.colors.light.primary};
  --color-brand-primary-foreground: ${system.colors.light.primaryForeground};

  --font-heading: "${system.typography.heading.family}", sans-serif;
  --font-body: "${system.typography.body.family}", sans-serif;

  --radius-brand-sm: ${system.radii.sm}px;
  --radius-brand-md: ${system.radii.md}px;
  --radius-brand-lg: ${system.radii.lg}px;
  --radius-brand-xl: ${system.radii.xl}px;
}`
}

export function exportTokens(
  system: BrandSystem,
) {
  return JSON.stringify(
    {
      version: 1,
      color: {
        primary: system.colors.primary,
        neutral: system.colors.neutral,
        light: system.colors.light,
        dark: system.colors.dark,
      },
      typography: system.typography,
      spacing: system.spacing,
      radius: system.radii,
      border: system.borders,
      shadow: system.shadows,
      motion: system.motion,
      wordmark: system.wordmark,
    },
    null,
    2,
  )
}

export function exportSummary(
  project: BrandProject,
  system: BrandSystem,
) {
  const primaryRatio = contrastRatio(
    system.colors.light.primary,
    system.colors.light.primaryForeground,
  )

  return `# ${project.name}

${project.summary}

## Descriptors

${project.keywords.map((word) => `- ${word}`).join("\n")}

## Brand DNA

${Object.entries(project.dna)
  .map(
    ([key, value]) =>
      `- ${key}: ${Math.round(value * 100)}%`,
  )
  .join("\n")}

## Typography

- Heading: ${system.typography.heading.family}
- Body: ${system.typography.body.family}
- Mono: ${system.typography.mono.family}

## Primary

${system.colors.light.primary}

## Contrast checks

Primary / Primary Foreground:
${primaryRatio.toFixed(2)}:1

## Generator

Version ${project.generatorVersion}
Seed: ${project.seed}
`
}

function downloadBlob(
  name: string,
  content: BlobPart,
  type: string,
) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement("a")

  anchor.href = url
  anchor.download = name
  anchor.click()

  URL.revokeObjectURL(url)
}

export function downloadText(
  name: string,
  value: string,
  type = "text/plain",
) {
  downloadBlob(name, value, type)
}

export async function downloadEverything(
  project: BrandProject,
  system: BrandSystem,
) {
  const zip = new JSZip()

  zip.file(
    "brand.css",
    exportCSS(system),
  )

  zip.file(
    "tailwind.css",
    exportTailwind(system),
  )

  zip.file(
    "brand.tokens.json",
    exportTokens(system),
  )

  zip.file(
    "BRAND.md",
    exportSummary(project, system),
  )

  zip.file(
    "brand.brandme.json",
    JSON.stringify(project, null, 2),
  )

  const result = await zip.generateAsync({
    type: "blob",
  })

  const url = URL.createObjectURL(result)
  const anchor = document.createElement("a")

  anchor.href = url

  anchor.download =
    `${project.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-brand.zip`

  anchor.click()

  URL.revokeObjectURL(url)
}