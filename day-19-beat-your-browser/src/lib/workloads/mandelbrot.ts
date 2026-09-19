import type {
  MandelbrotSpec,
} from "../../types/benchmark";

function iterate(
  cx: number,
  cy: number,
  maxIterations: number,
) {
  let x = 0;
  let y = 0;
  let iteration = 0;

  while (
    x * x + y * y <= 4 &&
    iteration < maxIterations
  ) {
    const nextX =
      x * x -
      y * y +
      cx;

    y =
      2 * x * y +
      cy;

    x = nextX;

    iteration += 1;
  }

  return iteration;
}

export function renderMandelbrot(
  spec: MandelbrotSpec,
): ArrayBuffer {
  const {
    width,
    height,
    maxIterations,
    samples,
  } = spec;

  const pixels =
    new Uint8ClampedArray(
      width * height * 4,
    );

  const side =
    Math.round(
      Math.sqrt(samples),
    );

  for (
    let py = 0;
    py < height;
    py += 1
  ) {
    for (
      let px = 0;
      px < width;
      px += 1
    ) {
      let iterationTotal = 0;

      for (
        let sy = 0;
        sy < side;
        sy += 1
      ) {
        for (
          let sx = 0;
          sx < side;
          sx += 1
        ) {
          const fx =
            (
              px +
              (sx + 0.5) / side
            ) / width;

          const fy =
            (
              py +
              (sy + 0.5) / side
            ) / height;

          iterationTotal +=
            iterate(
              -2.15 +
                fx * 3.2,
              -1.2 +
                fy * 2.4,
              maxIterations,
            );
        }
      }

      const average =
        iterationTotal /
        samples;

      const i =
        (py * width + px) * 4;

      if (
        average >=
        maxIterations - 0.5
      ) {
        pixels[i] = 7;
        pixels[i + 1] = 10;
        pixels[i + 2] = 13;
      } else {
        const t =
          average /
          maxIterations;

        pixels[i] =
          22 +
          Math.floor(
            45 * t,
          );

        pixels[i + 1] =
          80 +
          Math.floor(
            175 *
              Math.sqrt(t),
          );

        pixels[i + 2] =
          120 +
          Math.floor(
            125 *
              (1 - t),
          );
      }

      pixels[i + 3] = 255;
    }
  }

  return pixels.buffer;
}