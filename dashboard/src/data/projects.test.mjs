import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./projects.ts", import.meta.url), "utf8");

test("dashboard registers day 1 Cursor Chaos", () => {
  assert.match(source, /day:\s*1/);
  assert.match(source, /title:\s*"Cursor Chaos"/);
  assert.match(source, /liveUrl:\s*"[^"]*day-1-cursor-chaos/);
  assert.match(source, /twitterUrl\?:\s*string/);
});

test("dashboard registers day 2 Meeting Cost", () => {
  assert.match(source, /day:\s*2/);
  assert.match(source, /title:\s*"Meeting Cost"/);
  assert.match(source, /liveUrl:\s*"[^"]*day-2-meeting-cost/);
});
