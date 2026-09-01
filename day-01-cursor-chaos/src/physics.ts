export type Vec2 = { x: number; y: number };
export type GravityState = "down" | "right" | "up" | "left" | "off";
export type WindState = "calm" | "right" | "left" | "up";

export function cycleGravity(current: GravityState): GravityState {
  const states: GravityState[] = ["down", "right", "up", "left", "off"];
  return states[(states.indexOf(current) + 1) % states.length];
}

export function gravityVector(gravity: GravityState): Vec2 {
  if (gravity === "right") return { x: 1, y: 0 };
  if (gravity === "up") return { x: 0, y: -1 };
  if (gravity === "left") return { x: -1, y: 0 };
  if (gravity === "off") return { x: 0, y: 0 };
  return { x: 0, y: 1 };
}

export function gravityLabel(gravity: GravityState) {
  if (gravity === "right") return "RIGHT";
  if (gravity === "up") return "UP";
  if (gravity === "left") return "LEFT";
  if (gravity === "off") return "OFF";
  return "DOWN";
}

export function cycleWind(current: WindState): WindState {
  const states: WindState[] = ["calm", "right", "left", "up"];
  return states[(states.indexOf(current) + 1) % states.length];
}

export function windVector(wind: WindState): Vec2 {
  if (wind === "right") return { x: 0.000045, y: 0 };
  if (wind === "left") return { x: -0.000045, y: 0 };
  if (wind === "up") return { x: 0, y: -0.000055 };
  return { x: 0, y: 0 };
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
