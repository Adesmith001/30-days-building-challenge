import type {
  BrandSystem,
  SemanticTheme,
} from "../types"

function themeVariables(
  theme: SemanticTheme,
) {
  return {
    "--brand-background": theme.background,
    "--brand-surface": theme.surface,
    "--brand-surface-raised": theme.surfaceRaised,
    "--brand-foreground": theme.foreground,
    "--brand-muted": theme.mutedForeground,
    "--brand-border": theme.border,
    "--brand-input": theme.input,
    "--brand-primary": theme.primary,
    "--brand-primary-foreground":
      theme.primaryForeground,
    "--brand-secondary": theme.secondary,
    "--brand-secondary-foreground":
      theme.secondaryForeground,
    "--brand-accent": theme.accent,
    "--brand-accent-foreground":
      theme.accentForeground,
    "--brand-success": theme.success,
    "--brand-warning": theme.warning,
    "--brand-danger": theme.danger,
    "--brand-focus": theme.focus,
  }
}

export function systemVariables(
  system: BrandSystem,
  mode: "light" | "dark",
) {
  const theme =
    mode === "dark"
      ? system.colors.dark
      : system.colors.light

  return {
    ...themeVariables(theme),

    "--brand-heading":
      `"${system.typography.heading.family}", sans-serif`,

    "--brand-body":
      `"${system.typography.body.family}", sans-serif`,

    "--brand-mono":
      `"${system.typography.mono.family}", monospace`,

    "--radius-sm": `${system.radii.sm}px`,
    "--radius-md": `${system.radii.md}px`,
    "--radius-lg": `${system.radii.lg}px`,
    "--radius-xl": `${system.radii.xl}px`,

    "--motion-fast":
      `${system.motion.fast}ms`,

    "--motion-normal":
      `${system.motion.normal}ms`,

    "--motion-slow":
      `${system.motion.slow}ms`,

    "--shadow-sm": system.shadows.sm,
    "--shadow-md": system.shadows.md,
    "--shadow-lg": system.shadows.lg,
  } as React.CSSProperties
}