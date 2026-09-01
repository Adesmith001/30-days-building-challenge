import Matter from "matter-js";
import { WALL_SIZE } from "./constants";
import { clamp } from "./physics";
import type { PointerState } from "./types";

export function isMobileSize() {
  return window.innerWidth < 760;
}

export function makePointer(): PointerState {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 2;
  return { x, y, prevX: x, prevY: y, vx: 0, vy: 0, active: false, down: false, grabBody: null, grabOffsetX: 0, grabOffsetY: 0 };
}

export function rebuildWalls(world: Matter.World, walls: Matter.Body[], width: number, height: number) {
  Matter.Composite.remove(world, walls);
  const nextWalls = [
    Matter.Bodies.rectangle(width / 2, height + WALL_SIZE / 2, width + WALL_SIZE * 2, WALL_SIZE, { isStatic: true }),
    Matter.Bodies.rectangle(width / 2, -WALL_SIZE / 2, width + WALL_SIZE * 2, WALL_SIZE, { isStatic: true }),
    Matter.Bodies.rectangle(-WALL_SIZE / 2, height / 2, WALL_SIZE, height + WALL_SIZE * 2, { isStatic: true }),
    Matter.Bodies.rectangle(width + WALL_SIZE / 2, height / 2, WALL_SIZE, height + WALL_SIZE * 2, { isStatic: true }),
  ];
  Matter.Composite.add(world, nextWalls);
  return nextWalls;
}

export function canvasPointerPosition(canvas: HTMLCanvasElement, width: number, height: number, event: PointerEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clamp(event.clientX - rect.left, 0, width),
    y: clamp(event.clientY - rect.top, 0, height),
  };
}
