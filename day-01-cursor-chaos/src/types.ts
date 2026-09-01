import type Matter from "matter-js";
import type * as THREE from "three";
import type { GravityState, WindState } from "./physics";

export type ChaosShape = "circle" | "box" | "bar" | "triangle" | "ring";
export type MassClass = "light" | "medium" | "heavy";

export type ChaosObject = {
  body: Matter.Body;
  mesh: THREE.Mesh;
  shape: ChaosShape;
  massClass: MassClass;
};

export type PointerState = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  active: boolean;
  down: boolean;
  grabBody: Matter.Body | null;
  grabOffsetX: number;
  grabOffsetY: number;
};

export type WorldOptions = {
  gravity: GravityState;
  zeroG: boolean;
  wind: WindState;
};

export type WorldStats = {
  fps: number;
  objects: number;
};

export type WorldApi = {
  reset: () => void;
  spawn: () => void;
  pulse: () => void;
};
