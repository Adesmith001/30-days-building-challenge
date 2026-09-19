import type {
  BenchmarkComparison,
} from "../types/benchmark";

export function getComparisonInsight(
  comparison:
    BenchmarkComparison,
) {
  const main =
    comparison.main
      .measurement;

  const worker =
    comparison.worker
      .measurement;

  const smoothnessGain =
    main.maxFrameGapMs -
    worker.maxFrameGapMs;

  const workerTaskDelta =
    worker.taskDurationMs -
    main.taskDurationMs;

  const muchSmoother =
    worker.maxFrameGapMs <
    main.maxFrameGapMs *
      0.55;

  if (!muchSmoother) {
    return {
      line1:
        "THIS LOAD BARELY BLOCKED.",

      line2:
        "TRY HEAVIER IN THE LAB.",

      body:
        "On this run the workload did not create a large enough main-thread stall to make the responsiveness difference dramatic.",
    };
  }

  if (
    workerTaskDelta > 0
  ) {
    return {
      line1:
        "THE WORKER WASN'T FASTER.",

      line2:
        "THE UI WAS.",

      body:
        `The worker took ${Math.round(workerTaskDelta)}ms longer end-to-end, while reducing the largest observed UI stall by ${Math.round(smoothnessGain)}ms.`,
    };
  }

  return {
    line1:
      "THE WORK FINISHED SOONER.",

    line2:
      "THE UI ALSO KEPT MOVING.",

    body:
      `This run completed ${Math.round(Math.abs(workerTaskDelta))}ms sooner in the worker and reduced the largest observed UI stall by ${Math.round(smoothnessGain)}ms.`,
  };
}