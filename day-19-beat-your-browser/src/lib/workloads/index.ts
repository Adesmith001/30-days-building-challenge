import type {
  TaskOutput,
  TaskSpec,
} from "../../types/benchmark";

import {
  renderMandelbrot,
} from "./mandelbrot";

import {
  processPixels,
} from "./pixels";

import {
  countPrimes,
} from "./primes";

export function executeTask(
  spec: TaskSpec,
): TaskOutput {
  if (
    spec.task === "primes"
  ) {
    return {
      task: "primes",
      count:
        countPrimes(
          spec.limit,
        ),
    };
  }

  if (
    spec.task === "pixels"
  ) {
    return {
      task: "pixels",

      width:
        spec.width,

      height:
        spec.height,

      buffer:
        processPixels(spec),
    };
  }

  return {
    task: "mandelbrot",

    width:
      spec.width,

    height:
      spec.height,

    buffer:
      renderMandelbrot(spec),
  };
}