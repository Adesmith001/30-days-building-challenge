import test from "node:test";
import assert from "node:assert/strict";
import { computeCursorForce, cycleGravity, cycleTimeScale } from "./physics";

test("cursor force scales with velocity and fades with distance", () => {
  const near = computeCursorForce({
    bodyPosition: { x: 110, y: 100 },
    cursorPosition: { x: 100, y: 100 },
    cursorVelocity: { x: 12, y: 0 },
    radius: 100,
    mass: 2,
    strength: 0.02,
  });
  const far = computeCursorForce({
    bodyPosition: { x: 180, y: 100 },
    cursorPosition: { x: 100, y: 100 },
    cursorVelocity: { x: 12, y: 0 },
    radius: 100,
    mass: 2,
    strength: 0.02,
  });

  assert.equal(near.x > far.x, true);
  assert.equal(near.y, 0);
  assert.equal(far.x > 0, true);
});

test("gravity and time controls cycle through the expected visible states", () => {
  assert.equal(cycleGravity("down"), "right");
  assert.equal(cycleGravity("right"), "up");
  assert.equal(cycleGravity("up"), "left");
  assert.equal(cycleGravity("left"), "off");
  assert.equal(cycleGravity("off"), "down");

  assert.equal(cycleTimeScale(1), 0.5);
  assert.equal(cycleTimeScale(0.5), 0.15);
  assert.equal(cycleTimeScale(0.15), 1);
});
