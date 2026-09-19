import type {
  TaskOutput,
  TaskSpec,
} from "../types/benchmark";

type PendingTask = {
  resolve:
    (
      output:
        TaskOutput,
    ) => void;

  reject:
    (
      error:
        Error,
    ) => void;
};

let worker:
  Worker |
  null = null;

const pending =
  new Map<
    string,
    PendingTask
  >();

function ensureWorker() {
  if (worker) {
    return worker;
  }

  worker =
    new Worker(
      new URL(
        "../workers/benchmark.worker.ts",
        import.meta.url,
      ),
      {
        type: "module",
      },
    );

  worker.onmessage = (
    event:
      MessageEvent<{
        taskId: string;
        output: TaskOutput;
      }>,
  ) => {
    const task =
      pending.get(
        event.data.taskId,
      );

    if (!task) {
      return;
    }

    pending.delete(
      event.data.taskId,
    );

    task.resolve(
      event.data.output,
    );
  };

  worker.onerror = () => {
    for (
      const task of
      pending.values()
    ) {
      task.reject(
        new Error(
          "Worker execution failed.",
        ),
      );
    }

    pending.clear();

    worker?.terminate();

    worker = null;
  };

  return worker;
}

export function warmWorker() {
  ensureWorker();
}

export function runWorkerTask(
  spec: TaskSpec,
  taskId: string,
) {
  return new Promise<TaskOutput>(
    (
      resolve,
      reject,
    ) => {
      pending.set(
        taskId,
        {
          resolve,
          reject,
        },
      );

      ensureWorker()
        .postMessage({
          taskId,
          spec,
        });
    },
  );
}

export function terminateWorker() {
  worker?.terminate();

  worker = null;

  for (
    const task of
    pending.values()
  ) {
    task.reject(
      new Error(
        "Worker terminated.",
      ),
    );
  }

  pending.clear();
}