export type SceneThemeName = "graphite" | "tungsten" | "mint-night";

export type RevealPhase = "ground" | "rise" | "tilt" | "complete";

export type CameraMode = "overview" | "street" | "hall" | "repositories";

export interface SceneTheme {
  name: SceneThemeName;
  background: string;
  ground: string;
  building: string;
  emptyLot: string;
  accent: string;
  warm: string;
  fog: string;
}

export interface RevealState {
  progress: number;
  phase: RevealPhase;
}
