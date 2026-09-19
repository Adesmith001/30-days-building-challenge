import {
  useMemo,
  useRef,
  useState,
} from "react";

import {
  BenchmarkMetrics,
} from "../components/BenchmarkMetrics";

import {
  PrimaryButton,
} from "../components/PrimaryButton";

import {
  PulseProbe,
} from "../components/PulseProbe";

import {
  SectionLabel,
} from "../components/SectionLabel";

import {
  WorkloadCanvas,
} from "../components/WorkloadCanvas";

import {
  runBenchmark,
} from "../lib/benchmark";

import {
  buildTaskSpec,
  estimateLoadMs,
} from "../lib/calibration";

import {
  TASK_META,
} from "../lib/taskMeta";

import type {
  BenchmarkTask,
  CalibrationProfile,
  ExecutionMode,
  RunOutcome,
} from "../types/benchmark";

interface Props {
  profile:
    CalibrationProfile;
}

export function LabScreen({
  profile,
}: Props) {
  const [
    task,
    setTask,
  ] =
    useState<BenchmarkTask>(
      "primes",
    );

  const [
    mode,
    setMode,
  ] =
    useState<ExecutionMode>(
      "worker",
    );

  const [
    load,
    setLoad,
  ] =
    useState(1);

  const [
    outcome,
    setOutcome,
  ] =
    useState<RunOutcome | null>(
      null,
    );

  const [
    running,
    setRunning,
  ] =
    useState(false);

  const [
    taps,
    setTaps,
  ] =
    useState(0);

  const [
    error,
    setError,
  ] =
    useState("");

  const tapRef =
    useRef(0);

  const tapWindow =
    useRef(false);

  const spec =
    useMemo(
      () =>
        buildTaskSpec(
          task,
          profile,
          load,
        ),
      [
        task,
        profile,
        load,
      ],
    );

  const registerTap =
    () => {
      if (
        !tapWindow.current
      ) {
        return;
      }

      tapRef.current += 1;

      setTaps(
        tapRef.current,
      );
    };

  const run =
    async () => {
      setRunning(true);

      setOutcome(null);

      setError("");

      tapRef.current = 0;

      setTaps(0);

      try {
        const result =
          await runBenchmark(
            spec,
            {
              mode,

              targetFrameMs:
                profile.frameIntervalMs,

              readTaps:
                () =>
                  tapRef.current,

              setTapWindow:
                (
                  active,
                ) => {
                  tapWindow.current =
                    active;
                },
            },
          );

        setOutcome(
          result,
        );
      } catch (
        cause
      ) {
        setError(
          cause instanceof
              Error &&
            cause.message ===
              "TEST_INTERRUPTED"
            ? "TEST INTERRUPTED. Keep this tab visible and focused."
            : "The test failed. Try again.",
        );
      } finally {
        setRunning(
          false,
        );
      }
    };

  return (
    <main
      className="
        mx-auto
        max-w-6xl
        px-4
        py-8
        md:px-6
      "
    >
      <SectionLabel tone="lime">
        PERFORMANCE LAB / DEVICE-LOCAL
      </SectionLabel>

      <h1
        className="
          mt-3
          text-4xl
          font-semibold
          tracking-[-.045em]
          sm:text-5xl
        "
      >
        PUSH IT YOURSELF.
      </h1>

      <p
        className="
          mt-3
          max-w-2xl
          text-sm
          leading-6
          text-muted
        "
      >
        Choose the task, execution mode, and calibrated load. Estimates are intentionally capped; this is an interactive demo, not a standardized hardware benchmark.
      </p>

      <section
        className="
          mt-7
          grid
          gap-4
          border
          border-line
          bg-panel
          p-4
          lg:grid-cols-3
        "
      >
        <Control title="TASK">
          <div
            className="
              grid
              gap-2
            "
          >
            {(
              [
                "primes",
                "pixels",
                "mandelbrot",
              ] as BenchmarkTask[]
            ).map(
              (
                value,
              ) => (
                <Choice
                  key={
                    value
                  }
                  active={
                    task ===
                    value
                  }
                  onClick={() =>
                    setTask(
                      value,
                    )
                  }
                >
                  {
                    TASK_META[
                      value
                    ].title
                  }
                </Choice>
              ),
            )}
          </div>
        </Control>

        <Control title="MODE">
          <div
            className="
              grid
              grid-cols-2
              gap-2
            "
          >
            <Choice
              active={
                mode ===
                "main"
              }
              onClick={() =>
                setMode(
                  "main",
                )
              }
            >
              MAIN
            </Choice>

            <Choice
              active={
                mode ===
                "worker"
              }
              onClick={() =>
                setMode(
                  "worker",
                )
              }
            >
              WORKER
            </Choice>
          </div>
        </Control>

        <Control title="WORKLOAD">
          <input
            className="
              range-accent
              w-full
            "
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={
              load
            }
            onChange={(
              event,
            ) =>
              setLoad(
                Number(
                  event
                    .target
                    .value,
                ),
              )
            }
          />

          <div
            className="
              mt-3
              flex
              justify-between
              font-mono
              text-[10px]
              text-muted
            "
          >
            <span>
              {load.toFixed(
                1,
              )}
              ×
            </span>

            <span>
              EST. ~
              {
                estimateLoadMs(
                  profile,
                  load,
                )
              }
              ms
            </span>
          </div>
        </Control>
      </section>

      <div
        className="
          mt-4
          grid
          gap-4
          lg:grid-cols-[1.2fr_.8fr]
        "
      >
        <PulseProbe
          active={
            running
          }
          taps={
            taps
          }
          onTap={
            registerTap
          }
        />

        <WorkloadCanvas
          output={
            outcome?.output
          }
        />
      </div>

      {outcome && (
        <div
          className="
            mt-4
          "
        >
          <BenchmarkMetrics
            measurement={
              outcome.measurement
            }
          />
        </div>
      )}

      {error && (
        <div
          className="
            mt-4
            border
            border-danger/40
            bg-danger/5
            p-4
            font-mono
            text-xs
            text-danger
          "
        >
          {error}
        </div>
      )}

      <div
        className="
          mt-6
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <span
          className="
            font-mono
            text-[10px]
            text-dim
          "
        >
          LOADS ABOVE THE SAFE CAP ARE NOT EXPOSED.
        </span>

        <PrimaryButton
          tone={
            mode ===
            "worker"
              ? "cyan"
              : "lime"
          }
          disabled={
            running
          }
          onClick={
            run
          }
        >
          {running
            ? "RUNNING…"
            : "RUN TEST →"}
        </PrimaryButton>
      </div>
    </main>
  );
}

function Control({
  title,
  children,
}: {
  title: string;

  children:
    React.ReactNode;
}) {
  return (
    <div
      className="
        border
        border-line
        bg-canvas
        p-4
      "
    >
      <div
        className="
          mb-4
          font-mono
          text-[9px]
          text-muted
        "
      >
        {title}
      </div>

      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;

  onClick:
    () => void;

  children:
    React.ReactNode;
}) {
  return (
    <button
      onClick={
        onClick
      }
      className={`
        border
        px-3
        py-2
        text-left
        font-mono
        text-[10px]
        transition
        ${
          active
            ? "border-lime text-ink"
            : "border-line text-muted hover:border-muted"
        }
      `}
    >
      {children}
    </button>
  );
}