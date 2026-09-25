import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultParams,
  type AppScreen,
  type BenchmarkState,
  type CalibrationResult,
  type CameraPreset,
  type EngineMode,
  type InspectorData,
  type InteractionMode,
  type Metrics,
  type QualityMode,
  type SimParams,
} from "../types";
import { sendWorker } from "../simulation/runtime";

type Panel =
  | null
  | "engine"
  | "lab"
  | "benchmark"
  | "missions"
  | "more"
  | "about"
  | "share"
  | "naive-warning";

interface Store {
  screen: AppScreen;
  workerReady: boolean;

  population: number;
  engine: EngineMode;
  interaction: InteractionMode;
  playing: boolean;

  layoutId: string;
  quality: QualityMode;

  night: boolean;
  sound: boolean;
  trafficLights: boolean;

  showGrid: boolean;
  showHeatmap: boolean;
  showFlow: boolean;
  showNeighbours: boolean;

  cameraPreset: CameraPreset;

  photoMode: boolean;
  touring: boolean;

  panel: Panel;

  selectedId: number;
  blockedSegments: number[];

  params: SimParams;

  metrics: Metrics;
  inspector: InspectorData | null;

  calibration: CalibrationResult | null;

  benchmark: BenchmarkState;
  benchmarkHistory: BenchmarkState["results"];

  missions: Record<string, boolean>;

  recording: boolean;
  replayRequest: number;
  replaying: boolean;

  setWorkerReady: (ready: boolean) => void;
  startExperience: () => void;
  enterCity: () => void;

  setPopulation: (count: number) => void;
  forcePopulation: (count: number) => void;

  requestEngine: (engine: EngineMode) => void;
  confirmNaive: () => void;

  setInteraction: (mode: InteractionMode) => void;

  togglePlaying: () => void;
  step: () => void;

  setPanel: (panel: Panel) => void;

  toggleOverlay: (
    key: "grid" | "heatmap" | "flow" | "neighbours",
  ) => void;

  setCameraPreset: (preset: CameraPreset) => void;

  toggleNight: () => void;
  toggleSound: () => void;
  toggleTrafficLights: () => void;

  setPhotoMode: (value: boolean) => void;
  setTouring: (value: boolean) => void;

  selectAgent: (id: number) => void;

  toggleBlock: (index: number) => void;
  clearBlocks: () => void;
  randomIncident: () => void;

  setLayout: (id: string) => void;

  setParam: <K extends keyof SimParams>(
    key: K,
    value: SimParams[K],
  ) => void;

  resetParams: () => void;
  resetCity: () => void;

  calibrateResult: (result: CalibrationResult) => void;

  mergeMetrics: (metrics: Partial<Metrics>) => void;
  setInspector: (inspector: InspectorData | null) => void;

  setBlockedSegments: (segments: number[]) => void;

  benchmarkProgress: (
    engine: EngineMode,
    population: number,
    run: number,
    totalRuns: number,
  ) => void;

  benchmarkResult: (
    results: BenchmarkState["results"],
  ) => void;

  runBenchmark: () => void;

  completeMission: (mission: string) => void;

  toggleRecording: () => void;
  requestReplay: () => void;
  setReplaying: (value: boolean) => void;
}

const initialMetrics: Metrics = {
  fps: 0,
  frameMs: 0,
  simulationMs: 0,
  candidateChecks: 0,
  avgNeighbours: 0,
  occupiedCells: 0,
  simTime: 0,
};

export const useSimulationStore = create<Store>()(
  persist(
    (set, get) => ({
      screen: "landing",
      workerReady: false,

      population: 500,
      engine: "grid",
      interaction: "push",
      playing: true,

      layoutId: "mainland",
      quality: "auto",

      night: true,
      sound: false,
      trafficLights: true,

      showGrid: false,
      showHeatmap: false,
      showFlow: false,
      showNeighbours: false,

      cameraPreset: "city",

      photoMode: false,
      touring: false,

      panel: null,

      selectedId: -1,
      blockedSegments: [],

      params: { ...defaultParams },

      metrics: initialMetrics,
      inspector: null,

      calibration: null,

      benchmark: {
        running: false,
        results: [],
      },

      benchmarkHistory: [],

      missions: {},

      recording: false,
      replayRequest: 0,
      replaying: false,

      setWorkerReady: (workerReady) => set({ workerReady }),

      startExperience: () => {
        set({ screen: "calibrating" });
        sendWorker({ type: "CALIBRATE" });
      },

      enterCity: () => {
        set({
          screen: "city",
          population: 500,
        });

        sendWorker({
          type: "SET_POPULATION",
          count: 500,
        });
      },

      setPopulation: (count) => {
        const current = get();

        if (
          current.engine === "naive" &&
          current.calibration &&
          count > current.calibration.naiveSafeLimit
        ) {
          set({ panel: "naive-warning" });
          return;
        }

        set({ population: count });

        sendWorker({
          type: "SET_POPULATION",
          count,
        });

        if (count === 10_000) {
          get().completeMission("ten-k");
        }
      },

      forcePopulation: (population) => set({ population }),

      requestEngine: (requested) => {
        const current = get();

        if (
          requested === "naive" &&
          current.calibration &&
          current.population >
            current.calibration.naiveSafeLimit
        ) {
          set({ panel: "naive-warning" });
          return;
        }

        set({ engine: requested });

        sendWorker({
          type: "SET_ENGINE",
          engine: requested,
        });
      },

      confirmNaive: () => {
        const limit =
          get().calibration?.naiveSafeLimit ?? 2500;

        set({
          engine: "naive",
          population: limit,
          panel: "engine",
        });

        sendWorker({
          type: "SET_POPULATION",
          count: limit,
        });

        sendWorker({
          type: "SET_ENGINE",
          engine: "naive",
        });

        get().completeMission("naive");
      },

      setInteraction: (interaction) =>
        set({ interaction }),

      togglePlaying: () => {
        const playing = !get().playing;

        set({ playing });

        sendWorker({
          type: "SET_PLAYING",
          playing,
        });
      },

      step: () => {
        set({ playing: false });

        sendWorker({
          type: "SET_PLAYING",
          playing: false,
        });

        sendWorker({
          type: "STEP",
        });
      },

      setPanel: (panel) => set({ panel }),

      toggleOverlay: (key) => {
        if (key === "grid") {
          const showGrid = !get().showGrid;

          set({ showGrid });

          if (showGrid) get().completeMission("grid");
        }

        if (key === "heatmap") {
          set({ showHeatmap: !get().showHeatmap });
        }

        if (key === "flow") {
          set({ showFlow: !get().showFlow });
        }

        if (key === "neighbours") {
          set({
            showNeighbours: !get().showNeighbours,
          });
        }
      },

      setCameraPreset: (cameraPreset) =>
        set({ cameraPreset }),

      toggleNight: () => set({ night: !get().night }),

      toggleSound: () => set({ sound: !get().sound }),

      toggleTrafficLights: () => {
        const enabled = !get().trafficLights;

        set({ trafficLights: enabled });

        sendWorker({
          type: "SET_TRAFFIC_LIGHTS",
          enabled,
        });
      },

      setPhotoMode: (photoMode) => {
        set({ photoMode });

        if (photoMode) {
          get().completeMission("photo");
        }
      },

      setTouring: (touring) => set({ touring }),

      selectAgent: (id) => {
        set({
          selectedId: id,
          panel: id >= 0 ? "engine" : get().panel,
        });

        sendWorker({
          type: "SELECT",
          id,
        });

        if (id >= 0) {
          get().completeMission("inspect");
        }
      },

      toggleBlock: (segmentIndex) => {
        sendWorker({
          type: "TOGGLE_BLOCK",
          segmentIndex,
        });

        get().completeMission("roadblock");
      },

      clearBlocks: () =>
        sendWorker({
          type: "CLEAR_BLOCKS",
        }),

      randomIncident: () => {
        sendWorker({
          type: "RANDOM_INCIDENT",
        });

        get().completeMission("roadblock");
      },

      setLayout: (layoutId) => {
        set({
          layoutId,
          blockedSegments: [],
          selectedId: -1,
        });

        sendWorker({
          type: "SET_LAYOUT",
          layoutId,
        });
      },

      setParam: (key, value) => {
        set({
          params: {
            ...get().params,
            [key]: value,
          },
        });

        sendWorker({
          type: "SET_PARAMS",
          params: {
            [key]: value,
          },
        });
      },

      resetParams: () => {
        set({
          params: { ...defaultParams },
        });

        sendWorker({
          type: "SET_PARAMS",
          params: defaultParams,
        });
      },

      resetCity: () => {
        set({
          blockedSegments: [],
          selectedId: -1,
        });

        sendWorker({
          type: "RESET",
          seed: `lagos-${get().layoutId}`,
        });
      },

      calibrateResult: (result) =>
        set({
          calibration: result,
          quality: result.quality,
          screen: "ready",
        }),

      mergeMetrics: (metrics) =>
        set({
          metrics: {
            ...get().metrics,
            ...metrics,
          },
        }),

      setInspector: (inspector) => set({ inspector }),

      setBlockedSegments: (blockedSegments) =>
        set({ blockedSegments }),

      benchmarkProgress: (
        currentEngine,
        currentPopulation,
        run,
        totalRuns,
      ) =>
        set({
          benchmark: {
            ...get().benchmark,
            running: true,
            currentEngine,
            currentPopulation,
            run,
            totalRuns,
          },
        }),

      benchmarkResult: (results) => {
        set({
          benchmark: {
            running: false,
            results,
          },
          benchmarkHistory: results,
        });

        get().completeMission("benchmark");
      },

      runBenchmark: () => {
        set({
          panel: "benchmark",
          benchmark: {
            running: true,
            results: [],
          },
        });

        sendWorker({
          type: "RUN_BENCHMARK",
        });
      },

      completeMission: (mission) =>
        set({
          missions: {
            ...get().missions,
            [mission]: true,
          },
        }),

      toggleRecording: () =>
        set({
          recording: !get().recording,
        }),

      requestReplay: () =>
        set({
          replayRequest: get().replayRequest + 1,
        }),

      setReplaying: (replaying) =>
        set({ replaying }),
    }),
    {
      name: "10000-danfos",
      partialize: (state) => ({
        night: state.night,
        sound: state.sound,
        quality: state.quality,
        layoutId: state.layoutId,
        params: state.params,
        missions: state.missions,
        benchmarkHistory: state.benchmarkHistory,
      }),
    },
  ),
);
