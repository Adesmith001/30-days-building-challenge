export type Vec2 = { x: number; y: number };
export type CursorMode = "stir" | "attract" | "repel";

export function cycleMode(current: CursorMode): CursorMode {
  const states: CursorMode[] = ["stir", "attract", "repel"];
  return states[(states.indexOf(current) + 1) % states.length];
}

export function gravityVector(gravityOn: boolean): Vec2 {
  return gravityOn ? { x: 0, y: 1 } : { x: 0, y: 0 };
}

export function gravityLabel(gravityOn: boolean) {
  return gravityOn ? "ON" : "OFF";
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
