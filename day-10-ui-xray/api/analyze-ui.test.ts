import assert from "node:assert/strict";
import test from "node:test";

import * as analyzeUi from "./analyze-ui.ts";

test("requests complete JSON model responses", () => {
  const options = Reflect.get(
    analyzeUi,
    "MODEL_OUTPUT_OPTIONS",
  );

  assert.deepEqual(options, {
    max_completion_tokens: 3_000,
    response_format: { type: "json_object" },
  });
});
