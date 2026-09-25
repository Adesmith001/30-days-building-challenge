import { describe, expect, it } from "vitest";
import { badDeploy } from "@/data/incidents/bad-deploy";
import { cacheStampede } from "@/data/incidents/cache-stampede";
import { dbPool } from "@/data/incidents/db-pool";

describe("incident scenarios", () => {
  it("use unique identifiers and investigation skills", () => {
    const scenarios = [badDeploy, dbPool, cacheStampede];
    expect(new Set(scenarios.map((scenario) => scenario.id))).toHaveLength(3);
    expect(new Set(scenarios.map((scenario) => scenario.skill))).toHaveLength(3);
  });

  it("provide evidence-backed root causes and consequential actions", () => {
    for (const scenario of [badDeploy, dbPool, cacheStampede]) {
      expect(scenario.rootCause.criticalEvidenceIds.length).toBeGreaterThan(1);
      expect(scenario.actions.some((action) => action.effect === "mitigate")).toBe(true);
      expect(scenario.actions.some((action) => action.effect !== "mitigate")).toBe(true);
    }
  });
});
