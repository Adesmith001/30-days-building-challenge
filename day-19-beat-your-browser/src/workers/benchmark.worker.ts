/// <reference lib="webworker" />

import type {
  TaskOutput,
  TaskSpec,
} from "../types/benchmark";

import {
  executeTask,
} from "../lib/workloads";

interface WorkerRequest {
  taskId: string;

  spec: TaskSpec;
}

interface WorkerResponse {
  taskId: string;

  computeDurationMs: number;

  output: TaskOutput;
}

const ctx =
  self as unknown as
    DedicatedWorkerGlobalScope;

ctx.onmessage = (
  event:
    MessageEvent<WorkerRequest>,
) => {
  const {
    taskId,
    spec,
  } = event.data;

  const start =
    performance.now();

  const output =
    executeTask(spec);

  const response:
    WorkerResponse = {
      taskId,

      computeDurationMs:
        performance.now() -
        start,

      output,
    };

  if (
    output.task ===
    "primes"
  ) {
    ctx.postMessage(
      response,
    );

    return;
  }

  ctx.postMessage(
    response,
    [output.buffer],
  );
};

export {};