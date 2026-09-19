import type {
  BenchmarkMeasurement,
} from "../types/benchmark";

interface Props {
  measurement:
    BenchmarkMeasurement;
}

const format = (
  value: number,
) =>
  value < 1000
    ? `${Math.round(value)}ms`
    : `${(
        value / 1000
      ).toFixed(2)}s`;

export function BenchmarkMetrics({
  measurement,
}: Props) {
  const modeColor =
    measurement.mode ===
    "main"
      ? "text-amber"
      : "text-cyan";

  const metrics = [
    [
      "TASK TIME",
      format(
        measurement
          .taskDurationMs,
      ),
    ],

    [
      "MAX FRAME GAP",
      format(
        measurement
          .maxFrameGapMs,
      ),
    ],

    [
      "EST. MISSED FRAMES",
      measurement
        .estimatedMissedFrames
        .toLocaleString(),
    ],

    [
      "TAPS REGISTERED",
      measurement
        .tapsRegistered
        .toLocaleString(),
    ],
  ];

  return (
    <section
      className="
        grid
        gap-px
        border
        border-line
        bg-line
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      {metrics.map(
        (
          [
            label,
            value,
          ],
        ) => (
          <div
            key={
              label
            }
            className="
              bg-panel
              p-4
            "
          >
            <div
              className="
                mb-3
                font-mono
                text-[9px]
                tracking-[.1em]
                text-muted
              "
            >
              {label}
            </div>

            <div
              className={`
                metric
                font-mono
                text-2xl
                font-medium
                ${modeColor}
              `}
            >
              {value}
            </div>
          </div>
        ),
      )}
    </section>
  );
}