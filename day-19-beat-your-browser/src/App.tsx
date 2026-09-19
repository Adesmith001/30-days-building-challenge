import {
  useState,
} from "react";

import {
  GameHeader,
} from "./components/GameHeader";

import {
  toSavedRun,
} from "./lib/storage";

import {
  terminateWorker,
} from "./lib/workerClient";

import {
  useRunHistory,
} from "./hooks/useRunHistory";

import {
  AboutScreen,
} from "./screens/AboutScreen";

import {
  CalibrationScreen,
} from "./screens/CalibrationScreen";

import {
  ComparisonScreen,
} from "./screens/ComparisonScreen";

import {
  GuidedRoundScreen,
} from "./screens/GuidedRoundScreen";

import {
  HistoryScreen,
} from "./screens/HistoryScreen";

import {
  HomeScreen,
} from "./screens/HomeScreen";

import {
  LabScreen,
} from "./screens/LabScreen";

import {
  ResultsScreen,
} from "./screens/ResultsScreen";

import {
  UnsupportedScreen,
} from "./screens/UnsupportedScreen";

import type {
  BenchmarkComparison,
  BenchmarkTask,
  CalibrationProfile,
} from "./types/benchmark";

type Screen =
  | "home"
  | "calibration"
  | "guided"
  | "comparison"
  | "results"
  | "lab"
  | "history"
  | "about";

const TASKS:
  BenchmarkTask[] = [
  "primes",
  "pixels",
  "mandelbrot",
];

export default function App() {
  const [
    screen,
    setScreen,
  ] =
    useState<Screen>(
      "home",
    );

  const [
    profile,
    setProfile,
  ] =
    useState<CalibrationProfile | null>(
      null,
    );

  const [
    calibrationNext,
    setCalibrationNext,
  ] =
    useState<
      | "guided"
      | "lab"
    >(
      "guided",
    );

  const [
    roundIndex,
    setRoundIndex,
  ] =
    useState(0);

  const [
    comparisons,
    setComparisons,
  ] =
    useState<
      BenchmarkComparison[]
    >([]);

  const [
    current,
    setCurrent,
  ] =
    useState<BenchmarkComparison | null>(
      null,
    );

  const {
    runs,
    addRun,
    clearRuns,
  } =
    useRunHistory();

  if (
    typeof Worker ===
    "undefined"
  ) {
    return (
      <UnsupportedScreen />
    );
  }

  const resetExperiment =
    () => {
      terminateWorker();

      setScreen(
        "home",
      );

      setProfile(
        null,
      );

      setRoundIndex(0);

      setComparisons(
        [],
      );

      setCurrent(
        null,
      );
    };

  const startGuided =
    () => {
      setRoundIndex(0);

      setComparisons(
        [],
      );

      setCurrent(
        null,
      );

      setCalibrationNext(
        "guided",
      );

      setScreen(
        "calibration",
      );
    };

  const navigate = (
    target:
      | "home"
      | "lab"
      | "history"
      | "about",
  ) => {
    if (
      target === "lab" &&
      !profile
    ) {
      setCalibrationNext(
        "lab",
      );

      setScreen(
        "calibration",
      );

      return;
    }

    setScreen(
      target,
    );
  };

  const calibrationReady =
    (
      result:
        CalibrationProfile,
    ) => {
      setProfile(
        result,
      );

      setScreen(
        calibrationNext,
      );
    };

  const roundComplete =
    (
      comparison:
        BenchmarkComparison,
    ) => {
      setCurrent(
        comparison,
      );

      setScreen(
        "comparison",
      );
    };

  const continueComparison =
    () => {
      if (!current) {
        return;
      }

      const next = [
        ...comparisons,
        current,
      ];

      setComparisons(
        next,
      );

      setCurrent(
        null,
      );

      if (
        roundIndex <
        TASKS.length - 1
      ) {
        setRoundIndex(
          (value) =>
            value + 1,
        );

        setScreen(
          "guided",
        );

        return;
      }

      addRun(
        toSavedRun(
          next,
        ),
      );

      setScreen(
        "results",
      );
    };

  const active =
    screen === "lab"
      ? "lab"
      : screen ===
          "history"
        ? "history"
        : screen ===
            "about"
          ? "about"
          : "experiment";

  return (
    <div
      className="
        min-h-screen
        bg-canvas
        text-ink
      "
    >
      <GameHeader
        active={
          active
        }
        onNavigate={
          navigate
        }
        onReset={
          resetExperiment
        }
        sourceUrl={
          import.meta
            .env
            .VITE_SOURCE_URL
        }
      />

      {screen ===
        "home" && (
        <HomeScreen
          onStart={
            startGuided
          }
        />
      )}

      {screen ===
        "calibration" && (
        <CalibrationScreen
          onReady={
            calibrationReady
          }
        />
      )}

      {screen ===
        "guided" &&
        profile && (
          <GuidedRoundScreen
            key={
              TASKS[
                roundIndex
              ]
            }
            task={
              TASKS[
                roundIndex
              ]
            }
            profile={
              profile
            }
            onComplete={
              roundComplete
            }
          />
        )}

      {screen ===
        "comparison" &&
        profile &&
        current && (
          <ComparisonScreen
            comparison={
              current
            }
            profile={
              profile
            }
            finalRound={
              roundIndex ===
              TASKS.length -
                1
            }
            onContinue={
              continueComparison
            }
          />
        )}

      {screen ===
        "results" && (
        <ResultsScreen
          comparisons={
            comparisons
          }
          onLab={() =>
            setScreen(
              "lab",
            )
          }
          onRuns={() =>
            setScreen(
              "history",
            )
          }
          onAgain={
            startGuided
          }
        />
      )}

      {screen ===
        "lab" &&
        profile && (
          <LabScreen
            profile={
              profile
            }
          />
        )}

      {screen ===
        "history" && (
        <HistoryScreen
          runs={
            runs
          }
          onClear={
            clearRuns
          }
        />
      )}

      {screen ===
        "about" && (
        <AboutScreen />
      )}
    </div>
  );
}