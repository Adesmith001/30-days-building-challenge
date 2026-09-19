import { mulberry32 } from "../seed";

import type {
  PixelSpec,
} from "../../types/benchmark";

function createPattern(
  spec: PixelSpec,
) {
  const {
    width,
    height,
    seed,
  } = spec;

  const pixels =
    new Uint8ClampedArray(
      width * height * 4,
    );

  const random =
    mulberry32(seed);

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    for (
      let x = 0;
      x < width;
      x += 1
    ) {
      const i =
        (y * width + x) * 4;

      const wave =
        Math.sin(x * 0.035) * 42 +
        Math.cos(y * 0.047) * 36;

      const noise =
        (random() - 0.5) * 72;

      const radial =
        Math.hypot(
          x - width / 2,
          y - height / 2,
        ) /
        Math.max(
          width,
          height,
        );

      pixels[i] =
        90 +
        (x / width) * 130 +
        wave +
        noise;

      pixels[i + 1] =
        220 -
        radial * 190 +
        noise * 0.45;

      pixels[i + 2] =
        210 -
        (y / height) * 120 -
        wave * 0.35;

      pixels[i + 3] = 255;
    }
  }

  return pixels;
}

export function processPixels(
  spec: PixelSpec,
): ArrayBuffer {
  const {
    width,
    height,
    passes,
  } = spec;

  let source =
    createPattern(spec);

  let next =
    new Uint8ClampedArray(
      source.length,
    );

  const row =
    width * 4;

  for (
    let pass = 0;
    pass < passes;
    pass += 1
  ) {
    for (
      let y = 1;
      y < height - 1;
      y += 1
    ) {
      for (
        let x = 1;
        x < width - 1;
        x += 1
      ) {
        const i =
          (y * width + x) * 4;

        for (
          let channel = 0;
          channel < 3;
          channel += 1
        ) {
          const c =
            i + channel;

          const average =
            (
              source[c] * 4 +
              source[c - 4] +
              source[c + 4] +
              source[c - row] +
              source[c + row] +
              source[c - row - 4] +
              source[c - row + 4] +
              source[c + row - 4] +
              source[c + row + 4]
            ) / 12;

          next[c] =
            (average - 128) *
              1.06 +
            128;
        }

        next[i + 3] = 255;
      }
    }

    const previous = source;

    source = next;

    next = previous;
  }

  return source.buffer;
}