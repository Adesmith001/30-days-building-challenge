import type { ChaosObject, PointerState, WorldOptions } from "./types";

export function renderWorldText({
  options,
  fps,
  objects,
  pointer,
}: {
  options: WorldOptions;
  fps: number;
  objects: ChaosObject[];
  pointer: PointerState;
}) {
  return JSON.stringify({
    coordinateSystem: "origin top-left, x right, y down",
    mode: options.mode,
    gravity: options.gravityOn ? "on" : "off",
    fps: Math.round(fps),
    objects: objects.length,
    pointer: {
      x: Math.round(pointer.x),
      y: Math.round(pointer.y),
      vx: Math.round(pointer.vx),
      vy: Math.round(pointer.vy),
      active: pointer.active,
      grabbing: Boolean(pointer.grabBody),
    },
    visibleBodies: objects.slice(0, 12).map((item) => ({
      shape: item.shape,
      mass: item.massClass,
      x: Math.round(item.body.position.x),
      y: Math.round(item.body.position.y),
      vx: Number(item.body.velocity.x.toFixed(2)),
      vy: Number(item.body.velocity.y.toFixed(2)),
    })),
  });
}
