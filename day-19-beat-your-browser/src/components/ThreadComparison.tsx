import {
  motion,
} from "motion/react";

import type {
  BenchmarkComparison,
} from "../types/benchmark";

interface Props {
  comparison:
    BenchmarkComparison;
}

const ms = (
  value: number,
) =>
  `${Math.round(value)}ms`;

export function ThreadComparison({
  comparison,
}: Props) {
  const main =
    comparison.main
      .measurement;

  const worker =
    comparison.worker
      .measurement;

  const maxTask =
    Math.max(
      main.taskDurationMs,
      worker.taskDurationMs,
      1,
    );

  const maxGap =
    Math.max(
      main.maxFrameGapMs,
      worker.maxFrameGapMs,
      1,
    );

  const rows = [
    [
      "TASK TIME",
      main.taskDurationMs,
      worker.taskDurationMs,
      maxTask,
    ],

    [
      "MAX FRAME GAP",
      main.maxFrameGapMs,
      worker.maxFrameGapMs,
      maxGap,
    ],
  ] as const;

  return (
    <section
      className="
        border
        border-line
        bg-panel
      "
    >
      <div
        className="
          grid
          grid-cols-[1fr_1fr_1fr]
          border-b
          border-line
          px-4
          py-3
          font-mono
          text-[9px]
          tracking-[.1em]
          text-muted
        "
      >
        <span>
          METRIC
        </span>

        <span
          className="
            text-amber
          "
        >
          MAIN THREAD
        </span>

        <span
          className="
            text-cyan
          "
        >
          WEB WORKER
        </span>
      </div>

      {rows.map(
        (
          [
            label,
            mainValue,
            workerValue,
            maxValue,
          ],
        ) => (
          <div
            key={
              label
            }
            className="
              grid
              gap-4
              border-b
              border-line
              p-4
              last:border-0
              md:grid-cols-[180px_1fr_1fr]
            "
          >
            <div
              className="
                font-mono
                text-[10px]
                text-muted
              "
            >
              {label}
            </div>

            <MetricBar
              value={
                mainValue
              }
              max={
                maxValue
              }
              label={
                ms(
                  mainValue,
                )
              }
              tone="amber"
            />

            <MetricBar
              value={
                workerValue
              }
              max={
                maxValue
              }
              label={
                ms(
                  workerValue,
                )
              }
              tone="cyan"
            />
          </div>
        ),
      )}
    </section>
  );
}

function MetricBar({
  value,
  max,
  label,
  tone,
}: {
  value: number;

  max: number;

  label: string;

  tone:
    | "amber"
    | "cyan";
}) {
  return (
    <div>
      <div
        className={`
          metric
          mb-2
          font-mono
          text-lg
          ${
            tone ===
            "amber"
              ? "text-amber"
              : "text-cyan"
          }
        `}
      >
        {label}
      </div>

      <div
        className="
          h-1.5
          bg-canvas
        "
      >
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width:
              `${Math.max(
                4,
                (
                  value /
                  max
                ) * 100,
              )}%`,
          }}
          transition={{
            duration: 0.45,
          }}
          className={`
            h-full
            ${
              tone ===
              "amber"
                ? "bg-amber"
                : "bg-cyan"
            }
          `}
        />
      </div>
    </div>
  );
}