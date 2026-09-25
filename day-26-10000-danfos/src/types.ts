export const MAX_DANFOS = 10_000;

export type EngineMode = "grid" | "naive" | "quadtree";

export type InteractionMode =
  | "push"
  | "attract"
  | "vortex"
  | "roadblock"
  | "inspect";

export type CameraPreset = "city" | "top" | "junction" | "close";

export type QualityMode = "auto" | "high" | "low";

export type AppScreen = "landing" | "calibrating" | "ready" | "city";

export interface CityNode {
  id: string;
  name: string;
  x: number;
  z: number;
  signal?: boolean;
}

export interface CityEdge {
  a: number;
  b: number;
  width?: number;
}

export interface CityLayout {
  id: string;
  name: string;
  subtitle: string;
  nodes: CityNode[];
  edges: CityEdge[];
}

export interface SimParams {
  neighbourRadius: number;
  cellSize: number;
  maxSpeed: number;
  separation: number;
  alignment: number;
  cohesion: number;
  roadForce: number;
  pointerRadius: number;
}

export interface Metrics {
  fps: number;
  frameMs: number;
  simulationMs: number;
  candidateChecks: number;
  avgNeighbours: number;
  occupiedCells: number;
  simTime: number;
}

export interface InspectorData {
  id: number;
  speedKmh: number;
  route: string;
  state: string;
  neighbours: number;
  candidates: number;
  cellX: number;
  cellZ: number;
  neighbourIds: number[];
  searchedCells: Array<[number, number]>;
}

export interface CalibrationResult {
  naiveSafeLimit: number;
  maxRecommended: number;
  quality: QualityMode;
  sharedMemory: boolean;
}

export interface BenchmarkPoint {
  population: number;
  engine: EngineMode;
  simulationMs: number;
  candidateChecks: number;
  skipped?: boolean;
}

export interface BenchmarkState {
  running: boolean;
  currentEngine?: EngineMode;
  currentPopulation?: number;
  run?: number;
  totalRuns?: number;
  results: BenchmarkPoint[];
}

export interface PointerForce {
  active: boolean;
  x: number;
  z: number;
  mode: InteractionMode;
  radius: number;
}

export const defaultParams: SimParams = {
  neighbourRadius: 18,
  cellSize: 22,
  maxSpeed: 13.3,
  separation: 1.8,
  alignment: 0.6,
  cohesion: 0.18,
  roadForce: 2.4,
  pointerRadius: 38,
};
