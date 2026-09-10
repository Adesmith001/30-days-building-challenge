import assert from "node:assert/strict";
import test from "node:test";

import * as imageAnalysis from "../src/hooks/useImageAnalysis.ts";

test("shares parsed analysis without rereading the response body", async () => {
  const readAnalysisResponse = Reflect.get(
    imageAnalysis,
    "readAnalysisResponse",
  );

  assert.equal(typeof readAnalysisResponse, "function");

  let reads = 0;
  const payload = {
    border: {
      width: 1,
      style: "solid",
      color: "#E5E5E5",
      confidence: 0.8,
    },
    layout: {
      contentWidth: 1200,
      pageGutter: 32,
      columns: 12,
      sidebarWidth: null,
      confidence: 0.8,
    },
    personality: "Minimal interface.",
    confidence: 0.85,
  };
  const response = {
    ok: true,
    json: async () => {
      reads += 1;
      return payload;
    },
  } as Response;

  const parsed = readAnalysisResponse(response);
  const [first, second] = await Promise.all([
    parsed,
    parsed,
  ]);

  assert.deepEqual(first, second);
  assert.equal(reads, 1);
});
