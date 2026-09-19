import type {
  BenchmarkTask,
  CalibrationProfile,
  TaskSpec,
} from "../types/benchmark";

import {
  countPrimes,
} from "./workloads/primes";

import {
  estimateFrameInterval,
} from "./frames";

const clamp = (
  value: number,
  min: number,
  max: number,
) =>
  Math.min(
    max,
    Math.max(
      min,
      value,
    ),
  );

const roundTo = (
  value: number,
  step: number,
) =>
  Math.round(
    value / step,
  ) * step;

export async function calibrateDevice():
  Promise<CalibrationProfile> {
  const frameIntervalMs =
    await estimateFrameInterval();

  const sampleLimit =
    400_000;

  const start =
    performance.now();

  countPrimes(
    sampleLimit,
  );

  const sampleDurationMs =
    Math.max(
      4,
      performance.now() -
        start,
    );

  const targetTaskMs = 650;

  const ratio =
    targetTaskMs /
    sampleDurationMs;

  const estimatedLimit =
    sampleLimit *
    Math.pow(
      ratio,
      0.72,
    );

  const primeLimit =
    roundTo(
      clamp(
        estimatedLimit,
        650_000,
        5_500_000,
      ),
      25_000,
    );

  return {
    frameIntervalMs,
    primeLimit,
    targetTaskMs,
    sampleDurationMs,
  };
}

export function buildTaskSpec(
  task: BenchmarkTask,
  profile: CalibrationProfile,
  load = 1,
): TaskSpec {
  const safeLoad =
    clamp(
      load,
      0.5,
      3,
    );

  const speed =
    clamp(
      profile.primeLimit /
        3_000_000,
      0.55,
      1.45,
    );

  if (
    task === "primes"
  ) {
    return {
      task,

      limit:
        roundTo(
          clamp(
            profile.primeLimit *
              safeLoad,
            450_000,
            6_000_000,
          ),
          25_000,
        ),
    };
  }

  if (
    task === "pixels"
  ) {
    const scale =
      Math.sqrt(
        speed *
          safeLoad,
      );

    const width =
      roundTo(
        clamp(
          760 * scale,
          520,
          980,
        ),
        20,
      );

    return {
      task,

      width,

      height:
        roundTo(
          width * 0.625,
          10,
        ),

      passes:
        Math.round(
          clamp(
            24 +
              safeLoad * 16,
            28,
            52,
          ),
        ),

      seed:
        19092026,
    };
  }

  const scale =
    Math.sqrt(
      speed *
        safeLoad,
    );

  const width =
    roundTo(
      clamp(
        680 * scale,
        500,
        900,
      ),
      20,
    );

  return {
    task,

    width,

    height:
      roundTo(
        width * 0.667,
        10,
      ),

    maxIterations:
      Math.round(
        clamp(
          240 * scale,
          180,
          420,
        ),
      ),

    samples:
      safeLoad >= 1.8
        ? 9
        : 4,
  };
}

export function estimateLoadMs(
  profile: CalibrationProfile,
  load: number,
) {
  return Math.round(
    clamp(
      profile.targetTaskMs *
        load,
      220,
      1900,
    ),
  );
}