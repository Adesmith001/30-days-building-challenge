import {
  describe,
  expect,
  it,
} from "vitest";
import { badDeploy } from "@/data/incidents/bad-deploy";
import { createRun } from "@/lib/simulation";
import { calculateScore } from "@/lib/scoring";

describe("incident scoring", () => {
  it("rewards correct diagnosis", () => {
    const run = createRun(badDeploy);

    run.mitigationStartedAt = 120;

    run.rootCauseSubmission = {
      componentId: "checkout-api",
      cause: "deployment regression",
      trigger: "v2.4.1 rollout",
      notes: "",
    };

    run.evidence =
      badDeploy.rootCause.criticalEvidenceIds.map(
        (sourceId, index) => ({
          id: String(index),
          sourceId,
          kind: "metric",
          label: sourceId,
          at: 20,
        }),
      );

    run.hypotheses = [
      {
        id: "h1",
        componentId: "checkout-api",
        cause: "deployment regression",
        confidence: "HIGH",
        evidenceIds: [],
        at: 90,
      },
    ];

    const score = calculateScore(
      badDeploy,
      run,
    );

    expect(
      score.rootCause,
    ).toBeGreaterThan(2000);

    expect(
      score.investigation,
    ).toBeGreaterThan(1000);
  });
});
