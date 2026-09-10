import type {
  DesignSystem,
} from "../types/ui-analysis";

function activeColors(system: DesignSystem) {
  return system.colors.filter(
    (color) => !color.ignored,
  );
}

export function buildCssVariables(
  system: DesignSystem,
) {
  const colors = activeColors(system)
    .map(
      (token) =>
        `  --color-${token.name}: ${token.hex};`,
    )
    .join("\n");

  const spacing = system.spacing
    .map(
      (token) =>
        `  --space-${token.name}: ${token.value}px;`,
    )
    .join("\n");

  const radii = system.radii
    .map(
      (token) =>
        `  --radius-${token.name}: ${token.value}px;`,
    )
    .join("\n");

  return `:root {
${colors}

${spacing}

${radii}
}`;
}

export function buildTailwindTheme(
  system: DesignSystem,
) {
  const colors = activeColors(system)
    .map(
      (token) =>
        `  --color-${token.name}: ${token.hex};`,
    )
    .join("\n");

  const spacing = system.spacing
    .map(
      (token) =>
        `  --spacing-${token.name}: ${token.value}px;`,
    )
    .join("\n");

  const radii = system.radii
    .map(
      (token) =>
        `  --radius-${token.name}: ${token.value}px;`,
    )
    .join("\n");

  return `@theme {
${colors}

${spacing}

${radii}
}`;
}

export function buildJsonExport(
  system: DesignSystem,
) {
  const output = {
    colors: Object.fromEntries(
      activeColors(system).map((token) => [
        token.name,
        token.hex,
      ]),
    ),

    typography: Object.fromEntries(
      system.typography.map((token) => [
        token.name,
        {
          fontSize: token.size,
          lineHeight: token.lineHeight,
          fontWeight: token.weight,
          familyClass: token.familyClass,
        },
      ]),
    ),

    spacing: Object.fromEntries(
      system.spacing.map((token) => [
        token.name,
        token.value,
      ]),
    ),

    radius: Object.fromEntries(
      system.radii.map((token) => [
        token.name,
        token.value,
      ]),
    ),

    border: system.border,
    shadows: system.shadows,

    layout: system.layout,
  };

  return JSON.stringify(output, null, 2);
}