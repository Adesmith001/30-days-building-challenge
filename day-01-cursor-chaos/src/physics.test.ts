import test from "node:test";
import assert from "node:assert/strict";
import { cycleMode, gravityLabel, gravityVector } from "./physics";

test("mode control cycles through the required PRD modes", () => {
  assert.equal(cycleMode("stir"), "attract");
  assert.equal(cycleMode("attract"), "repel");
  assert.equal(cycleMode("repel"), "stir");
});

test("gravity toggle exposes on and off physics states", () => {
  assert.equal(gravityLabel(true), "ON");
  assert.equal(gravityLabel(false), "OFF");
  assert.deepEqual(gravityVector(true), { x: 0, y: 1 });
  assert.deepEqual(gravityVector(false), { x: 0, y: 0 });
});
