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
} from "../lib/calibration";

import {
  GUIDED_LOADS,
  TASK_META,
} from "../lib/taskMeta";

import type {
  BenchmarkComparison,
  BenchmarkTask,
  CalibrationProfile,
  RunOutcome,
} from "../types/benchmark";

type Phase =
  | "intro"
  | "main-ready"
  | "main-result"
  | "worker-ready"
  | "worker-result";

interface Props {
  task:
    BenchmarkTask;

  profile:
    CalibrationProfile;

  onComplete:
    (
      comparison:
        BenchmarkComparison,
    ) => void;
}

export function GuidedRoundScreen({
  task,
  profile,
  onComplete,
}: Props) {
  const [
    phase,
    setPhase,
  ] =
    useState<Phase>(
      "intro",
    );

  const [
    running,
    setRunning,
  ] =
    useState(false);

  const [
    main,
    setMain,
  ] =
    useState<RunOutcome | null>(
      null,
    );

  const [
    worker,
    setWorker,
  ] =
    useState<RunOutcome | null>(
      null,
    );

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

  const meta =
    TASK_META[task];

  const spec =
    useMemo(
      () =>
        buildTaskSpec(
          task,
          profile,
          GUIDED_LOADS[
            task
          ],
        ),
      [
        task,
        profile,
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
    async (
      mode:
        | "main"
        | "worker",
    ) => {
      setRunning(true);

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

        if (
          mode === "main"
        ) {
          setMain(
            result,
          );

          setPhase(
            "main-result",
          );
        } else {
          setWorker(
            result,
          );

          setPhase(
            "worker-result",
          );
        }
      } catch (
        cause
      ) {
        setError(
          cause instanceof
              Error &&
            cause.message ===
              "TEST_INTERRUPTED"
            ? "TEST INTERRUPTED. Keep this tab visible and focused, then run again."
            : "The benchmark failed. Try the round again.",
        );
      } finally {
        setRunning(
          false,
        );
      }
    };

  if (
    phase === "intro"
  ) {
    return (
      <Centered>
        <SectionLabel tone="lime">
          {meta.kicker}
        </SectionLabel>

        <h1
          className="
            mt-4
            text-4xl
            font-semibold
            tracking-[-.045em]
            sm:text-6xl
          "
        >
          {meta.title}
        </h1>

        <p
          className="
            mt-4
            max-w-2xl
            text-sm
            leading-6
            text-muted
          "
        >
          {
            meta.description
          }
        </p>

        <SpecReadout
          spec={
            spec
          }
        />

        <PrimaryButton
          className="mt-6"
          onClick={() =>
            setPhase(
              "main-ready",
            )
          }
        >
          START ROUND →
        </PrimaryButton>
      </Centered>
    );
  }

  const mode =
    phase.startsWith(
      "main",
    )
      ? "main"
      : "worker";

  const result =
    mode === "main"
      ? main
      : worker;

  const ready =
    phase ===
      "main-ready" ||
    phase ===
      "worker-ready";

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
      <div
        className="
          mb-6
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
          border-b
          border-line
          pb-5
        "
      >
        <div>
          <SectionLabel
            tone={
              mode ===
              "main"
                ? "amber"
                : "cyan"
            }
          >
            {meta.kicker}
          </SectionLabel>

          <h1
            className="
              mt-2
              text-3xl
              font-semibold
              tracking-[-.04em]
              sm:text-4xl
            "
          >
            {running
              ? mode ===
                "main"
                ? "CRUNCHING…"
                : "WORKER CRUNCHING…"
              : mode ===
                  "main"
                ? "FIRST: MAIN THREAD."
                : "SAME WORK. DIFFERENT THREAD."}
          </h1>
        </div>

        <span
          className={`
            border
            px-2
            py-1
            font-mono
            text-[9px]
            ${
              mode ===
              "main"
                ? "border-amber/50 text-amber"
                : "border-cyan/50 text-cyan"
            }
          `}
        >
          {mode ===
          "main"
            ? "MAIN_THREAD"
            : "OFF_THREAD_WORKER"}
        </span>
      </div>

      <div
        className="
          grid
          gap-4
          lg:grid-cols-[1.25fr_.75fr]
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
            result?.output
          }
        />
      </div>

      {result && (
        <div
          className="
            mt-4
          "
        >
          <BenchmarkMetrics
            measurement={
              result.measurement
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
          flex-wrap
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
          {mode ===
          "main"
            ? "THE PAGE MAY FREEZE BRIEFLY."
            : "KEEP TAPPING WHILE THE WORKER RUNS."}
        </span>

        {ready && (
          <PrimaryButton
            tone={
              mode ===
              "main"
                ? "lime"
                : "cyan"
            }
            disabled={
              running
            }
            onClick={() =>
              run(
                mode,
              )
            }
          >
            {meta.action} →
          </PrimaryButton>
        )}

        {phase ===
          "main-result" && (
          <PrimaryButton
            tone="cyan"
            onClick={() =>
              setPhase(
                "worker-ready",
              )
            }
          >
            NOW TRY A WORKER →
          </PrimaryButton>
        )}

        {phase ===
          "worker-result" &&
          main &&
          worker && (
            <PrimaryButton
              onClick={() =>
                onComplete(
                  {
                    task,
                    main,
                    worker,
                  },
                )
              }
            >
              COMPARE →
            </PrimaryButton>
          )}
      </div>
    </main>
  );
}

function Centered({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <main
      className="
        mx-auto
        grid
        min-h-[calc(100vh-56px)]
        max-w-5xl
        place-items-center
        px-4
        py-12
        md:px-6
      "
    >
      <section
        className="
          w-full
          border
          border-line
          bg-panel
          p-6
          sm:p-10
        "
      >
        {children}
      </section>
    </main>
  );
}

function SpecReadout({
  spec,
}: {
  spec:
    ReturnType<
      typeof buildTaskSpec
    >;
}) {
  const text =
    spec.task ===
    "primes"
      ? `${spec.limit.toLocaleString()} CANDIDATES`
      : spec.task ===
          "pixels"
        ? `${spec.width} × ${spec.height} · ${spec.passes} PASSES`
        : `${spec.width} × ${spec.height} · ${spec.maxIterations} ITER · ${spec.samples}× SAMPLES`;

  return (
    <div
      className="
        mt-7
        border
        border-line
        bg-canvas
        p-4
        font-mono
        text-sm
        text-lime
      "
    >
      {text}
    </div>
  );
}