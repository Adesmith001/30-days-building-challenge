import {
  useEffect,
  useState,
} from "react";

import {
  PrimaryButton,
} from "../components/PrimaryButton";

import {
  SectionLabel,
} from "../components/SectionLabel";

import {
  calibrateDevice,
} from "../lib/calibration";

import {
  warmWorker,
} from "../lib/workerClient";

import type {
  CalibrationProfile,
} from "../types/benchmark";

interface Props {
  onReady:
    (
      profile:
        CalibrationProfile,
    ) => void;
}

export function CalibrationScreen({
  onReady,
}: Props) {
  const [
    profile,
    setProfile,
  ] =
    useState<CalibrationProfile | null>(
      null,
    );

  const [
    error,
    setError,
  ] = useState("");

  useEffect(
    () => {
      let alive = true;

      warmWorker();

      calibrateDevice()
        .then(
          (
            result,
          ) => {
            if (alive) {
              setProfile(
                result,
              );
            }
          },
        )
        .catch(
          () => {
            if (alive) {
              setError(
                "Calibration failed. Reload and try again.",
              );
            }
          },
        );

      return () => {
        alive = false;
      };
    },
    [],
  );

  return (
    <main
      className="
        mx-auto
        grid
        min-h-[calc(100vh-56px)]
        max-w-4xl
        place-items-center
        px-4
        py-12
        md:px-6">
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
        <SectionLabel tone="lime">
          SETUP / DEVICE-LOCAL
        </SectionLabel>

        <h1
          className="
            mt-4
            text-4xl
            font-semibold
            tracking-[-.04em]
            sm:text-5xl
          "
        >
          QUICK CALIBRATION.
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
          A short deterministic workload estimates a sensible load for this browser. This is not a device ranking.
        </p>

        <div
          className="
            mt-8
            border
            border-line
            bg-canvas
            p-5
          "
        >
          {!profile &&
            !error && (
              <CalibrationBars />
            )}

          {profile && (
            <div
              className="
                grid
                gap-4
                sm:grid-cols-3
              "
            >
              <Readout
                label="STATUS"
                value="READY"
                tone="text-lime"
              />

              <Readout
                label="FRAME INTERVAL"
                value={
                  `${profile.frameIntervalMs.toFixed(1)}ms`
                }
              />

              <Readout
                label="TEST LOAD"
                value="BALANCED"
              />
            </div>
          )}

          {error && (
            <div
              className="
                font-mono
                text-sm
                text-danger
              "
            >
              {error}
            </div>
          )}
        </div>

        {profile && (
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
              WORKLOADS ARE CAPPED TO KEEP THE EXPERIMENT USABLE.
            </span>

            <PrimaryButton
              onClick={() =>
                onReady(
                  profile,
                )
              }
            >
              BEGIN →
            </PrimaryButton>
          </div>
        )}
      </section>
    </main>
  );
}

function CalibrationBars() {
  return (
    <div>
      <div
        className="
          font-mono
          text-[10px]
          text-lime
        "
      >
        CALIBRATING…
      </div>

      <div
        className="
          mt-4
          flex
          h-16
          items-end
          gap-1
        "
      >
        {Array.from(
          {
            length: 30,
          },
          (
            _,
            index,
          ) => (
            <span
              key={
                index
              }
              className="
                w-full
                animate-pulse
                bg-lime/60
              "
              style={{
                height:
                  8 +
                  (index %
                    7) *
                    6,
              }}
            />
          ),
        )}
      </div>
    </div>
  );
}

function Readout({
  label,
  value,
  tone = "text-ink",
}: {
  label: string;

  value: string;

  tone?: string;
}) {
  return (
    <div>
      <div
        className="
          font-mono
          text-[9px]
          text-muted
        "
      >
        {label}
      </div>

      <div
        className={`
          metric
          mt-2
          font-mono
          text-xl
          ${tone}
        `}
      >
        {value}
      </div>
    </div>
  );
}