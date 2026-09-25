import { describe, expect, it } from "vitest";
import { badDeploy } from "@/data/incidents/bad-deploy";
import { advanceRun, createRun } from "@/lib/simulation";

describe("incident progression", () => {
  it("advances simulated time and customer impact", () => {
    const run = createRun(badDeploy);
    const next = advanceRun(badDeploy, run, 60);
    expect(next.simulatedTime).toBe(60);
    expect(next.impact).toBe(run.impact + badDeploy.impactPerMinute);
  });

  it("stops adding impact after recovery verification begins", () => {
    const run = { ...createRun(badDeploy), status: "verifying" as const };
    expect(advanceRun(badDeploy, run, 60).impact).toBe(run.impact);
  });
});
