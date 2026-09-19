import type {
  ExecutionMode,
  RunOutcome,
  TaskSpec,
} from "../types/benchmark";

import {
  createFrameMonitor,
  waitForFrames,
} from "./frames";

import {
  createLongTaskMonitor,
} from "./longTasks";

import {
  outputSignature,
} from "./signature";

import {
  executeTask,
} from "./workloads";

import {
  runWorkerTask,
} from "./workerClient";

interface RunOptions {
  mode: ExecutionMode;

  targetFrameMs: number;

  readTaps:
    () => number;

  setTapWindow:
    (
      active: boolean,
    ) => void;
}

const makeTaskId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

export async function runBenchmark(
  spec: TaskSpec,
  options: RunOptions,
): Promise<RunOutcome> {
  const {
    mode,
    targetFrameMs,
    readTaps,
    setTapWindow,
  } = options;

  const frames =
    createFrameMonitor(
      targetFrameMs,
    );

  const longTasks =
    createLongTaskMonitor();

  let interrupted = false;
  let stopped = false;

  const interrupt = () => {
    interrupted = true;
  };

  const visibility = () => {
    if (
      document.hidden
    ) {
      interrupted = true;
    }
  };

  window.addEventListener(
    "blur",
    interrupt,
  );

  document.addEventListener(
    "visibilitychange",
    visibility,
  );

  try {
    frames.start();

    longTasks.start();

    setTapWindow(true);

    /*
     * Give React and the Pulse a few
     * frames to visibly enter the
     * running state before blocking.
     */
    await waitForFrames(3);

    const start =
      performance.now();

    const output =
      mode === "main"
        ? executeTask(spec)
        : await runWorkerTask(
            spec,
            makeTaskId(),
          );

    const taskDurationMs =
      performance.now() -
      start;

    /*
     * Stop accepting queued taps
     * immediately when computation
     * finishes.
     */
    setTapWindow(false);

    /*
     * We need frames after the task so
     * the rAF monitor can actually see
     * the main-thread gap.
     */
    await waitForFrames(2);

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          0,
        ),
    );

    const frameStats =
      frames.stop();

    const longTaskCount =
      longTasks.stop();

    stopped = true;

    if (interrupted) {
      throw new Error(
        "TEST_INTERRUPTED",
      );
    }

    return {
      output,

      measurement: {
        task:
          spec.task,

        mode,

        taskDurationMs,

        maxFrameGapMs:
          frameStats
            .maxGapMs,

        estimatedMissedFrames:
          frameStats
            .estimatedMissedFrames,

        frameSamples:
          frameStats
            .samples,

        tapsRegistered:
          readTaps(),

        longTaskCount,

        outputSignature:
          outputSignature(
            output,
          ),
      },
    };
  } finally {
    setTapWindow(false);

    if (!stopped) {
      frames.stop();
      longTasks.stop();
    }

    window.removeEventListener(
      "blur",
      interrupt,
    );

    document.removeEventListener(
      "visibilitychange",
      visibility,
    );
  }
}