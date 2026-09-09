import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("loads the Vercel function with Node ESM resolution", () => {
  const result = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--input-type=module",
      "--eval",
      'import("./api/duck.ts")',
    ],
    {
      cwd: new URL("../", import.meta.url),
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 0, result.stderr);
});
