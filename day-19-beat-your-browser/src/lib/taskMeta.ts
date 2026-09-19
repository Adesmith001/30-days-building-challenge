import type {
  BenchmarkTask,
} from "../types/benchmark";

export const TASK_META:
  Record<
    BenchmarkTask,
    {
      title: string;

      kicker: string;

      description: string;

      action: string;
    }
  > = {
  primes: {
    title:
      "NUMBER CRUNCH.",

    kicker:
      "ROUND 01 / FIND PRIMES",

    description:
      "Count primes with deterministic trial division. Same limit, same math, two execution contexts.",

    action:
      "COUNT PRIMES",
  },

  pixels: {
    title:
      "PIXEL CRUNCH.",

    kicker:
      "ROUND 02 / IMAGE PROCESSING",

    description:
      "Generate and repeatedly transform a deterministic RGBA buffer. Millions of channel operations, no remote image.",

    action:
      "PROCESS PIXELS",
  },

  mandelbrot: {
    title:
      "FINAL BOSS: MANDELBROT.",

    kicker:
      "ROUND 03 / FRACTAL RENDER",

    description:
      "Render the same fractal bounds and iteration budget. The finished images should match exactly.",

    action:
      "RENDER FRACTAL",
  },
};

export const GUIDED_LOADS:
  Record<
    BenchmarkTask,
    number
  > = {
  primes: 0.82,

  pixels: 1.08,

  mandelbrot: 1.3,
};