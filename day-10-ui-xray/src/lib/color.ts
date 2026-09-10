export interface SampledColor {
  hex: string;
  occurrences: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function componentToHex(value: number) {
  return value
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
}

export function rgbToHex(rgb: RGB) {
  return `#${componentToHex(rgb.r)}${componentToHex(
    rgb.g,
  )}${componentToHex(rgb.b)}`;
}

export function hexToRgb(hex: string): RGB {
  const normalized = hex.replace("#", "");

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

export function colorDistance(
  a: string,
  b: string,
) {
  const first = hexToRgb(a);
  const second = hexToRgb(b);

  return Math.sqrt(
    (first.r - second.r) ** 2 +
      (first.g - second.g) ** 2 +
      (first.b - second.b) ** 2,
  );
}

function quantize(value: number) {
  return Math.min(
    255,
    Math.round(value / 16) * 16,
  );
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>(
    (resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => reject(
        new Error("Could not sample image colors."),
      );

      image.src = source;
    },
  );
}

export async function sampleDominantColors(
  source: string,
): Promise<SampledColor[]> {
  const image = await loadImage(source);

  const canvas = document.createElement("canvas");

  canvas.width = 140;
  canvas.height = 140;

  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) {
    return [];
  }

  context.drawImage(
    image,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const pixels = context.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  ).data;

  const histogram = new Map<string, number>();

  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] < 180) {
      continue;
    }

    const hex = rgbToHex({
      r: quantize(pixels[index]),
      g: quantize(pixels[index + 1]),
      b: quantize(pixels[index + 2]),
    });

    histogram.set(
      hex,
      (histogram.get(hex) ?? 0) + 1,
    );
  }

  const ranked = [...histogram.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([hex, occurrences]) => ({
      hex,
      occurrences,
    }));

  const clustered: SampledColor[] = [];

  for (const candidate of ranked) {
    const duplicate = clustered.some(
      (existing) =>
        colorDistance(
          existing.hex,
          candidate.hex,
        ) < 28,
    );

    if (!duplicate) {
      clustered.push(candidate);
    }

    if (clustered.length === 10) {
      break;
    }
  }

  return clustered;
}