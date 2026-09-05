import type { Point, PointerSnapshot } from "../types/game";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function clampPoint(
  point: Point,
  bounds: Point,
  buttonWidth: number,
): Point {
  const xPadding = Math.max(58, buttonWidth / 2 + 20);
  const yPadding = 52;

  return {
    x: clamp(point.x, xPadding, Math.max(xPadding, bounds.x - xPadding)),
    y: clamp(point.y, yPadding, Math.max(yPadding, bounds.y - yPadding)),
  };
}

export function randomPoint(bounds: Point, buttonWidth: number): Point {
  const paddingX = Math.max(70, buttonWidth / 2 + 24);
  const paddingY = 64;

  return {
    x: paddingX + Math.random() * Math.max(1, bounds.x - paddingX * 2),
    y: paddingY + Math.random() * Math.max(1, bounds.y - paddingY * 2),
  };
}

export function awayPoint(
  current: Point,
  threat: Point,
  amount: number,
  bounds: Point,
  buttonWidth: number,
) {
  let dx = current.x - threat.x;
  let dy = current.y - threat.y;

  if (Math.abs(dx) + Math.abs(dy) < 0.01) {
    dx = Math.random() - 0.5;
    dy = Math.random() - 0.5;
  }

  const magnitude = Math.hypot(dx, dy) || 1;
  const jitter = () => (Math.random() - 0.5) * 70;

  return clampPoint(
    {
      x: current.x + (dx / magnitude) * amount + jitter(),
      y: current.y + (dy / magnitude) * amount + jitter(),
    },
    bounds,
    buttonWidth,
  );
}

export function predictedPoint(
  pointer: PointerSnapshot,
  predictionMs: number,
): Point {
  return {
    x: pointer.x + pointer.velocityX * predictionMs,
    y: pointer.y + pointer.velocityY * predictionMs,
  };
}

export function separatedPoints(
  count: number,
  bounds: Point,
  buttonWidth: number,
) {
  const result: Point[] = [];
  let attempts = 0;

  while (result.length < count && attempts < 80) {
    const point = randomPoint(bounds, buttonWidth);
    const valid = result.every((other) => distance(point, other) > 130);

    if (valid) {
      result.push(point);
    }

    attempts += 1;
  }

  while (result.length < count) {
    result.push(randomPoint(bounds, buttonWidth));
  }

  return result;
}