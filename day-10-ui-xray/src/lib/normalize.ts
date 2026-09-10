/* eslint-disable @typescript-eslint/no-unused-expressions */
import { colorDistance } from "./color";

import type {
  ColorToken,
  DesignSystem,
  NumberToken,
  RawColor,
  SpacingSample,
  TypographySample,
  TypeToken,
  UIAnalysis,
} from "../types/ui-analysis";

import type {
  SampledColor,
} from "./color";

function slug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function colorName(role: string) {
  const value = role.toLowerCase();

  if (value.includes("background")) return "background";
  if (value.includes("surface")) return "surface";
  if (value.includes("muted")) return "muted";
  if (value.includes("border")) return "border";
  if (value.includes("primary text")) return "text";
  if (value.includes("text")) return "text";
  if (value.includes("accent")) return "primary";
  if (value.includes("primary")) return "primary";
  if (value.includes("success")) return "success";
  if (value.includes("warning")) return "warning";
  if (value.includes("destructive")) return "danger";

  return slug(role) || "color";
}

function uniqueNames(values: string[]) {
  const counts = new Map<string, number>();

  return values.map((value) => {
    const count = counts.get(value) ?? 0;

    counts.set(value, count + 1);

    return count === 0
      ? value
      : `${value}-${count + 1}`;
  });
}

function normalizeColors(
  colors: RawColor[],
  sampled: SampledColor[],
): ColorToken[] {
  const groups: RawColor[][] = [];

  for (const color of colors) {
    const match = groups.find((group) =>
      colorDistance(group[0].hex, color.hex) < 24,
    );

    if (match) {
      match.push(color);
    } else {
      groups.push([color]);
    }
  }

  const merged = groups.map((group) => {
    const best = [...group].sort(
      (a, b) => b.confidence - a.confidence,
    )[0];

    return {
      ...best,
      occurrences: group.reduce(
        (sum, item) => sum + item.occurrences,
        0,
      ),
      bounds: group.flatMap(
        (item) => item.bounds,
      ),
      usage: [
        ...new Set(
          group.flatMap((item) => item.usage),
        ),
      ],
      kind: group.some(
        (item) => item.kind === "ui",
      )
        ? "ui"
        : "content",
    } satisfies RawColor;
  });

  const extras = sampled.filter((sample) =>
    merged.every(
      (color) =>
        colorDistance(
          color.hex,
          sample.hex,
        ) > 32,
    ),
  );

  for (const sample of extras.slice(0, 4)) {
    merged.push({
      hex: sample.hex,
      role: "sampled content color",
      kind: "content",
      confidence: 0.55,
      occurrences: sample.occurrences,
      bounds: [],
      usage: [],
    });
  }

  const names = uniqueNames(
    merged.map((color) =>
      colorName(color.role),
    ),
  );

  return merged.map((color, index) => ({
    ...color,
    id: `color-${index}`,
    name: names[index],
  }));
}

function normalizeTypography(
  samples: TypographySample[],
): TypeToken[] {
  const groups: TypographySample[][] = [];

  const ordered = [...samples].sort(
    (a, b) =>
      b.estimatedSize - a.estimatedSize,
  );

  for (const sample of ordered) {
    const match = groups.find((group) => {
      const first = group[0];

      return (
        Math.abs(
          first.estimatedSize -
            sample.estimatedSize,
        ) <= 2 &&
        Math.abs(
          first.estimatedWeight -
            sample.estimatedWeight,
        ) <= 100
      );
    });

    match ? match.push(sample) : groups.push([sample]);
  }

  const names = uniqueNames(
    groups.map((group) =>
      slug(group[0].role || "text"),
    ),
  );

  return groups.map((group, index) => {
    const average = (
      key:
        | "estimatedSize"
        | "estimatedWeight"
        | "estimatedLineHeight",
    ) =>
      group.reduce(
        (sum, item) => sum + item[key],
        0,
      ) / group.length;

    return {
      id: `type-${index}`,
      name: names[index],
      sample: group[0].text,
      size: Math.round(average("estimatedSize")),
      weight:
        Math.round(
          average("estimatedWeight") / 100,
        ) * 100,
      lineHeight: Math.round(
        average("estimatedLineHeight"),
      ),
      familyClass: group[0].familyClass,
      confidence:
        group.reduce(
          (sum, item) => sum + item.confidence,
          0,
        ) / group.length,
      bounds: group.flatMap(
        (item) => item.bounds,
      ),
    };
  });
}

function normalizeNumbers(
  samples: SpacingSample[],
  names: string[],
  prefix: string,
): NumberToken[] {
  const groups: SpacingSample[][] = [];

  const ordered = [...samples]
    .filter((item) => item.value > 0)
    .sort((a, b) => a.value - b.value);

  for (const sample of ordered) {
    const match = groups.find(
      (group) =>
        Math.abs(
          group[0].value - sample.value,
        ) <= 3,
    );

    match ? match.push(sample) : groups.push([sample]);
  }

  return groups.slice(0, names.length).map(
    (group, index) => {
      const average =
        group.reduce(
          (sum, item) => sum + item.value,
          0,
        ) / group.length;

      return {
        id: `${prefix}-${index}`,
        name: names[index],
        value: Math.max(
          1,
          Math.round(average / 4) * 4,
        ),
        confidence:
          group.reduce(
            (sum, item) =>
              sum + item.confidence,
            0,
          ) / group.length,
        bounds: group.flatMap(
          (item) => item.bounds,
        ),
      };
    },
  );
}

function normalizeRadii(
  values: UIAnalysis["radii"],
): NumberToken[] {
  const fakeSpacing = values.map((item) => ({
    value: item.value,
    role: "radius",
    confidence: item.confidence,
    bounds: item.bounds,
  }));

  const tokens = normalizeNumbers(
    fakeSpacing,
    ["sm", "md", "lg", "xl", "full"],
    "radius",
  );

  return tokens.map((token) => ({
    ...token,
    value:
      token.value > 100
        ? 9999
        : token.value,
  }));
}

function averageConfidence(
  values: { confidence: number }[],
) {
  if (!values.length) return 0.6;

  return (
    values.reduce(
      (sum, item) => sum + item.confidence,
      0,
    ) / values.length
  );
}

export function normalizeAnalysis(
  analysis: UIAnalysis,
  sampled: SampledColor[],
): DesignSystem {
  const colors = normalizeColors(
    analysis.colors,
    sampled,
  );

  const typography = normalizeTypography(
    analysis.typography,
  );

  const spacing = normalizeNumbers(
    analysis.spacing,
    ["xs", "sm", "md", "lg", "xl", "2xl"],
    "space",
  );

  const confidence =
    analysis.confidence * 0.4 +
    averageConfidence(analysis.colors) * 0.15 +
    averageConfidence(analysis.typography) * 0.15 +
    averageConfidence(analysis.sections) * 0.15 +
    averageConfidence(analysis.components) * 0.15;

  return {
    colors,
    typography,
    spacing,
    radii: normalizeRadii(analysis.radii),
    shadows: analysis.shadows,
    border: analysis.border,
    components: analysis.components,
    sections: analysis.sections,
    layout: analysis.layout,
    personality: analysis.personality,
    confidence: Math.round(confidence * 100),
  };
}