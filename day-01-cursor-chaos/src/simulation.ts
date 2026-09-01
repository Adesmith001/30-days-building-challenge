import Matter from "matter-js";
import { clamp, gravityVector, windVector } from "./physics";
import { CURSOR_RADIUS } from "./constants";
import type { ChaosObject, PointerState, WorldOptions } from "./types";

export function applyEnvironment(engine: Matter.Engine, objects: ChaosObject[], options: WorldOptions) {
  const gravity = options.zeroG ? { x: 0, y: 0 } : gravityVector(options.gravity);
  engine.gravity.x = gravity.x;
  engine.gravity.y = gravity.y;
  engine.gravity.scale = options.zeroG ? 0 : 0.00082;

  const wind = windVector(options.wind);
  if (!wind.x && !wind.y) return;
  for (const item of objects) Matter.Body.applyForce(item.body, item.body.position, wind);
}

export function applyCursorGravity(objects: ChaosObject[], pointer: PointerState) {
  if (!pointer.active) return;
  for (const item of objects) {
    if (item.body === pointer.grabBody) continue;
    const dx = pointer.x - item.body.position.x;
    const dy = pointer.y - item.body.position.y;
    const distance = Math.max(12, Math.hypot(dx, dy));
    if (distance > CURSOR_RADIUS) continue;
    const pull = ((1 - distance / CURSOR_RADIUS) * 0.00028) / Math.max(0.8, item.body.mass);
    Matter.Body.applyForce(item.body, item.body.position, { x: (dx / distance) * pull, y: (dy / distance) * pull });
  }
}

export function applyGrab(pointer: PointerState) {
  if (!pointer.grabBody) return;
  Matter.Body.setPosition(pointer.grabBody, {
    x: pointer.x + pointer.grabOffsetX,
    y: pointer.y + pointer.grabOffsetY,
  });
  Matter.Body.setVelocity(pointer.grabBody, { x: pointer.vx * 0.1, y: pointer.vy * 0.1 });
}

export function applyPulse(objects: ChaosObject[], pointer: PointerState) {
  for (const item of objects) {
    const dx = item.body.position.x - pointer.x;
    const dy = item.body.position.y - pointer.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    if (distance > 300) continue;
    Matter.Body.applyForce(item.body, item.body.position, {
      x: (dx / distance) * 0.012,
      y: (dy / distance) * 0.012,
    });
  }
}

export function containObjects(objects: ChaosObject[], width: number, height: number) {
  for (const item of objects) {
    if (Math.abs(item.body.velocity.x) > 28 || Math.abs(item.body.velocity.y) > 28) {
      Matter.Body.setVelocity(item.body, {
        x: clamp(item.body.velocity.x, -28, 28),
        y: clamp(item.body.velocity.y, -28, 28),
      });
    }
    const out = item.body.position.x < -140 || item.body.position.x > width + 140 || item.body.position.y < -300 || item.body.position.y > height + 140;
    if (!out) continue;
    Matter.Body.setPosition(item.body, {
      x: clamp(item.body.position.x, 34, width - 34),
      y: clamp(item.body.position.y, 34, height - 34),
    });
    Matter.Body.setVelocity(item.body, {
      x: clamp(item.body.velocity.x * -0.25, -8, 8),
      y: clamp(item.body.velocity.y * -0.25, -8, 8),
    });
  }
}

export function syncMeshes(objects: ChaosObject[], width: number, height: number) {
  for (const item of objects) {
    item.mesh.position.set(item.body.position.x - width / 2, height / 2 - item.body.position.y, 0);
    item.mesh.rotation.z = -item.body.angle;
    item.mesh.rotation.x += item.body.angularVelocity * 0.006;
    item.mesh.rotation.y += item.body.velocity.x * 0.00045;
  }
}
