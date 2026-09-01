import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./projects.ts", import.meta.url), "utf8");

test("dashboard registers day 1 Cursor Chaos", () => {
  assert.match(source, /day:\s*1/);
  assert.match(source, /title:\s*"Cursor Chaos"/);
  assert.match(source, /liveUrl:\s*"[^"]*day-01-cursor-chaos/);
  assert.match(source, /twitterUrl\?:\s*string/);
});
