import { useEffect } from "react";
import { MAX_DANFOS } from "../types";
import { runtime } from "../simulation/runtime";
import { useSimulationStore } from "../store/useSimulationStore";

export function useSimulationWorker() {
  useEffect(() => {
    const worker = new Worker(
      new URL(
        "../workers/simulation.worker.ts",
        import.meta.url,
      ),
      {
        type: "module",
      },
    );

    runtime.worker = worker;

    const canShare =
      typeof SharedArrayBuffer !== "undefined" &&
      window.crossOriginIsolated;

    let sharedBuffer: SharedArrayBuffer | undefined;

    if (canShare) {
      sharedBuffer = new SharedArrayBuffer(
        8 + MAX_DANFOS * 4 * 4,
      );

      runtime.sharedHeader = new Int32Array(
        sharedBuffer,
        0,
        2,
      );

      runtime.liveBuffer = new Float32Array(
        sharedBuffer,
        8,
        MAX_DANFOS * 4,
      );
    }

    worker.postMessage({
      type: "INIT",
      layoutId:
        useSimulationStore.getState().layoutId,
      population:
        useSimulationStore.getState().population,
      sharedBuffer,
    });

    worker.onmessage = (event) => {
      const message = event.data;
      const store = useSimulationStore.getState();

      switch (message.type) {
        case "READY":
          store.setWorkerReady(true);
          break;

        case "SNAPSHOT": {
          const previous = runtime.transferView;

          const next = new Float32Array(message.buffer);

          runtime.transferView = next;
          runtime.liveBuffer = next;

          if (previous) {
            worker.postMessage(
              {
                type: "RECYCLE",
                buffer: previous.buffer,
              },
              [previous.buffer],
            );
          }

          break;
        }

        case "STATS":
          store.mergeMetrics(message.metrics);
          store.setInspector(message.inspector);
          break;

        case "CALIBRATION":
          store.calibrateResult(message.result);
          break;

        case "BLOCKED":
          store.setBlockedSegments(
            message.blockedSegments,
          );
          break;

        case "POPULATION_CLAMPED":
          store.forcePopulation(
            message.population,
          );
          break;

        case "BENCHMARK_PROGRESS":
          store.benchmarkProgress(
            message.engine,
            message.population,
            message.run,
            message.totalRuns,
          );
          break;

        case "BENCHMARK_RESULT":
          store.benchmarkResult(
            message.results,
          );
          break;
      }
    };

    return () => {
      worker.terminate();
      runtime.worker = null;
    };
  }, []);
}
