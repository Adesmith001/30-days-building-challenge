import Matter from "matter-js";
import { clamp, gravityVector } from "./physics";
import { CURSOR_RADIUS } from "./constants";
import type { ChaosObject, PointerState, WorldOptions } from "./types";

export function applyEnvironment(engine: Matter.Engine, options: WorldOptions) {
  const gravity = gravityVector(options.gravityOn);
  engine.gravity.x = gravity.x;
  engine.gravity.y = gravity.y;
  engine.gravity.scale = options.gravityOn ? 0.00082 : 0;
}

export function applyCursorForces(objects: ChaosObject[], pointer: PointerState, options: WorldOptions) {
  if (!pointer.active) return;
  for (const item of objects) {
    if (item.body === pointer.grabBody) continue;
    const dx = item.body.position.x - pointer.x;
    const dy = item.body.position.y - pointer.y;
    const distance = Math.max(12, Math.hypot(dx, dy));
    if (distance > CURSOR_RADIUS) continue;
    const proximity = 1 - distance / CURSOR_RADIUS;
    const held = pointer.down ? 2.1 : 1;
    const mass = Math.max(0.8, item.body.mass);

    if (options.mode === "stir") {
      Matter.Body.applyForce(item.body, item.body.position, {
        x: (pointer.vx * proximity * 0.000095 * held) / mass,
        y: (pointer.vy * proximity * 0.000095 * held) / mass,
      });
    } else {
      const direction = options.mode === "repel" ? 1 : -1;
      const strength = (0.00013 + proximity * 0.00024) * held;
      Matter.Body.applyForce(item.body, item.body.position, {
        x: (dx / distance) * strength * direction,
        y: (dy / distance) * strength * direction,
      });
    }
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
