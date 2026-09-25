import { beforeEach, describe, expect, it } from "vitest";
import { useGameStore } from "@/store/use-game-store";
import { badDeploy } from "@/data/incidents/bad-deploy";
import { createRun } from "@/lib/simulation";
import { buildTimeline } from "@/lib/timeline";

describe("game store", () => {
  beforeEach(() => {
    localStorage.clear();
    useGameStore.setState({
      view: "landing",
      run: null,
      history: [],
      shift: null,
      completedShift: null,
    });
  });

  it("starts and acknowledges an incident", () => {
    useGameStore.getState().startIncident("bad-deploy");
    expect(useGameStore.getState().view).toBe("incident");
    expect(useGameStore.getState().run?.status).toBe("alert");

    useGameStore.getState().acknowledge();
    expect(useGameStore.getState().run?.status).toBe("investigating");
  });

  it("does not pin the same evidence twice", () => {
    useGameStore.getState().startIncident("bad-deploy");
    const pin = { sourceId: "error-rate", kind: "metric" as const, label: "Error rate" };
    useGameStore.getState().pinEvidence(pin);
    useGameStore.getState().pinEvidence(pin);
    expect(useGameStore.getState().run?.evidence).toHaveLength(1);
  });

  it("preserves system events in the incident timeline", () => {
    const scenario = {
      ...badDeploy,
      events: [
        ...badDeploy.events,
        { id: "system-check", offset: 0, label: "SYSTEM CHECK", kind: "system" as const },
      ],
    };
    expect(buildTimeline(scenario, createRun(scenario))).toContainEqual(
      expect.objectContaining({ id: "system-check", kind: "system" }),
    );
  });
});
