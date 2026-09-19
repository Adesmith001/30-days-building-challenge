export type ExecutionMode =
  | "main"
  | "worker";

export type BenchmarkTask =
  | "primes"
  | "pixels"
  | "mandelbrot";

export interface PrimeSpec {
  task: "primes";
  limit: number;
}

export interface PixelSpec {
  task: "pixels";
  width: number;
  height: number;
  passes: number;
  seed: number;
}

export interface MandelbrotSpec {
  task: "mandelbrot";
  width: number;
  height: number;
  maxIterations: number;
  samples: 1 | 4 | 9;
}

export type TaskSpec =
  | PrimeSpec
  | PixelSpec
  | MandelbrotSpec;

export type TaskOutput =
  | {
      task: "primes";
      count: number;
    }
  | {
      task: "pixels";
      width: number;
      height: number;
      buffer: ArrayBuffer;
    }
  | {
      task: "mandelbrot";
      width: number;
      height: number;
      buffer: ArrayBuffer;
    };

export interface BenchmarkMeasurement {
  task: BenchmarkTask;
  mode: ExecutionMode;

  taskDurationMs: number;

  maxFrameGapMs: number;

  estimatedMissedFrames: number;

  frameSamples: number[];

  tapsRegistered: number;

  longTaskCount?: number;

  outputSignature: string;
}

export interface RunOutcome {
  measurement: BenchmarkMeasurement;
  output: TaskOutput;
}

export interface BenchmarkComparison {
  task: BenchmarkTask;

  main: RunOutcome;

  worker: RunOutcome;
}

export interface CalibrationProfile {
  frameIntervalMs: number;

  primeLimit: number;

  targetTaskMs: number;

  sampleDurationMs: number;
}

export interface SavedRound {
  task: BenchmarkTask;

  mainTaskMs: number;

  workerTaskMs: number;

  mainGapMs: number;

  workerGapMs: number;
}

export interface SavedRun {
  id: string;

  createdAt: string;

  totalMainMs: number;

  totalWorkerMs: number;

  worstMainGapMs: number;

  worstWorkerGapMs: number;

  rounds: SavedRound[];
}