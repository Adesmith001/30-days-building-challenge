import {
  FrameStrip,
} from "../components/FrameStrip";

import {
  PrimaryButton,
} from "../components/PrimaryButton";

import {
  SectionLabel,
} from "../components/SectionLabel";

import {
  ThreadComparison,
} from "../components/ThreadComparison";

import {
  WorkloadCanvas,
} from "../components/WorkloadCanvas";

import {
  getComparisonInsight,
} from "../lib/insights";

import type {
  BenchmarkComparison,
  CalibrationProfile,
} from "../types/benchmark";

interface Props {
  comparison:
    BenchmarkComparison;

  profile:
    CalibrationProfile;

  finalRound:
    boolean;

  onContinue:
    () => void;
}

export function ComparisonScreen({
  comparison,
  profile,
  finalRound,
  onContinue,
}: Props) {
  const insight =
    getComparisonInsight(
      comparison,
    );

  const main =
    comparison.main
      .measurement;

  const worker =
    comparison.worker
      .measurement;

  const sameOutput =
    main.outputSignature ===
    worker.outputSignature;

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
        ROUND COMPARISON / REAL DEVICE DATA
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
        SAME WORK. DIFFERENT THREAD.
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
        Completion time and interface responsiveness are separate measurements. Workers are not guaranteed to finish sooner.
      </p>

      <div
        className="
          mt-7
        "
      >
        <ThreadComparison
          comparison={
            comparison
          }
        />
      </div>

      {comparison.task !==
        "primes" && (
        <div
          className="
            mt-4
            grid
            gap-4
            md:grid-cols-2
          "
        >
          <div>
            <div
              className="
                mb-2
                font-mono
                text-[9px]
                text-amber
              "
            >
              MAIN OUTPUT
            </div>

            <WorkloadCanvas
              compact
              output={
                comparison
                  .main
                  .output
              }
            />
          </div>

          <div>
            <div
              className="
                mb-2
                font-mono
                text-[9px]
                text-cyan
              "
            >
              WORKER OUTPUT
            </div>

            <WorkloadCanvas
              compact
              output={
                comparison
                  .worker
                  .output
              }
            />
          </div>
        </div>
      )}

      <div
        className="
          mt-4
          grid
          gap-4
          md:grid-cols-2
        "
      >
        <FrameStrip
          samples={
            main.frameSamples
          }
          targetFrameMs={
            profile.frameIntervalMs
          }
          mode="main"
        />

        <FrameStrip
          samples={
            worker.frameSamples
          }
          targetFrameMs={
            profile.frameIntervalMs
          }
          mode="worker"
        />
      </div>

      <section
        className="
          mt-4
          border
          border-line
          bg-panel
          p-5
          sm:p-7
        "
      >
        <div
          className="
            font-mono
            text-[9px]
            text-muted
          "
        >
          OUTPUT CHECK ·{" "}
          {sameOutput ? (
            <span
              className="
                text-lime
              "
            >
              MATCHED
            </span>
          ) : (
            <span
              className="
                text-danger
              "
            >
              MISMATCH
            </span>
          )}
        </div>

        <h2
          className="
            mt-5
            text-3xl
            font-semibold
            tracking-[-.04em]
            text-muted
            sm:text-5xl
          "
        >
          {insight.line1}
        </h2>

        <h2
          className="
            mt-1
            text-3xl
            font-semibold
            tracking-[-.04em]
            text-lime
            sm:text-5xl
          "
        >
          {insight.line2}
        </h2>

        <p
          className="
            mt-5
            max-w-3xl
            text-sm
            leading-6
            text-muted
          "
        >
          {insight.body}
        </p>

        {comparison.task ===
          "mandelbrot" &&
          sameOutput && (
            <div
              className="
                mt-5
                font-mono
                text-[10px]
                tracking-[.12em]
                text-cyan
              "
            >
              SAME IMAGE. SAME MATH. DIFFERENT RESPONSIVENESS.
            </div>
          )}
      </section>

      <div
        className="
          mt-6
          flex
          justify-end
        "
      >
        <PrimaryButton
          onClick={
            onContinue
          }
        >
          {finalRound
            ? "SEE FINAL RESULTS →"
            : "NEXT ROUND →"}
        </PrimaryButton>
      </div>
    </main>
  );
}