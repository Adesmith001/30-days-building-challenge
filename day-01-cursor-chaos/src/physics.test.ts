import test from "node:test";
import assert from "node:assert/strict";
import { cycleGravity, cycleWind, gravityVector, windVector } from "./physics";

test("gravity control cycles through directions and off", () => {
  assert.equal(cycleGravity("down"), "right");
  assert.equal(cycleGravity("right"), "up");
  assert.equal(cycleGravity("up"), "left");
  assert.equal(cycleGravity("left"), "off");
  assert.equal(cycleGravity("off"), "down");

  assert.deepEqual(gravityVector("down"), { x: 0, y: 1 });
  assert.deepEqual(gravityVector("off"), { x: 0, y: 0 });
});

test("wind controls cycle through calm, left, right, and updraft", () => {
  assert.equal(cycleWind("calm"), "right");
  assert.equal(cycleWind("right"), "left");
  assert.equal(cycleWind("left"), "up");
  assert.equal(cycleWind("up"), "calm");

  assert.deepEqual(windVector("calm"), { x: 0, y: 0 });
  assert.deepEqual(windVector("right"), { x: 0.000045, y: 0 });
  assert.deepEqual(windVector("left"), { x: -0.000045, y: 0 });
  assert.deepEqual(windVector("up"), { x: 0, y: -0.000055 });
});
