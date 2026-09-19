import type {
  BenchmarkComparison,
  SavedRun,
} from "../types/benchmark";

const KEY =
  "beat-your-browser:runs:v1";

export function loadRuns():
  SavedRun[] {
  try {
    const raw =
      localStorage.getItem(
        KEY,
      );

    return raw
      ? JSON.parse(
          raw,
        ) as SavedRun[]
      : [];
  } catch {
    return [];
  }
}

export function saveRuns(
  runs: SavedRun[],
) {
  localStorage.setItem(
    KEY,
    JSON.stringify(
      runs.slice(
        0,
        20,
      ),
    ),
  );
}

export function toSavedRun(
  comparisons:
    BenchmarkComparison[],
): SavedRun {
  const totalMainMs =
    comparisons.reduce(
      (
        sum,
        item,
      ) =>
        sum +
        item.main
          .measurement
          .taskDurationMs,
      0,
    );

  const totalWorkerMs =
    comparisons.reduce(
      (
        sum,
        item,
      ) =>
        sum +
        item.worker
          .measurement
          .taskDurationMs,
      0,
    );

  const worstMainGapMs =
    Math.max(
      ...comparisons.map(
        (item) =>
          item.main
            .measurement
            .maxFrameGapMs,
      ),
    );

  const worstWorkerGapMs =
    Math.max(
      ...comparisons.map(
        (item) =>
          item.worker
            .measurement
            .maxFrameGapMs,
      ),
    );

  return {
    id:
      crypto.randomUUID(),

    createdAt:
      new Date()
        .toISOString(),

    totalMainMs,

    totalWorkerMs,

    worstMainGapMs,

    worstWorkerGapMs,

    rounds:
      comparisons.map(
        (item) => ({
          task:
            item.task,

          mainTaskMs:
            item.main
              .measurement
              .taskDurationMs,

          workerTaskMs:
            item.worker
              .measurement
              .taskDurationMs,

          mainGapMs:
            item.main
              .measurement
              .maxFrameGapMs,

          workerGapMs:
            item.worker
              .measurement
              .maxFrameGapMs,
        }),
      ),
  };
}