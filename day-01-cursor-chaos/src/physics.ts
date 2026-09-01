export type Vec2 = { x: number; y: number };
export type GravityState = "down" | "right" | "up" | "left" | "off";
export type CursorMode = "stir" | "attract" | "repel" | "vortex";
export type TimeScale = 1 | 0.5 | 0.15;

export function computeCursorForce({
  bodyPosition,
  cursorPosition,
  cursorVelocity,
  radius,
  mass,
  strength,
}: {
  bodyPosition: Vec2;
  cursorPosition: Vec2;
  cursorVelocity: Vec2;
  radius: number;
  mass: number;
  strength: number;
}): Vec2 {
  const dx = bodyPosition.x - cursorPosition.x;
  const dy = bodyPosition.y - cursorPosition.y;
  const distance = Math.hypot(dx, dy);

  if (distance > radius || distance === 0) return { x: 0, y: 0 };

  const proximity = 1 - distance / radius;
  const massFactor = Math.max(0.25, mass);

  return {
    x: (cursorVelocity.x * proximity * strength) / massFactor,
    y: (cursorVelocity.y * proximity * strength) / massFactor,
  };
}

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

export function cycleTimeScale(current: TimeScale): TimeScale {
  if (current === 1) return 0.5;
  if (current === 0.5) return 0.15;
  return 1;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
