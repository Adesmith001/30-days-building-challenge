import type {
  IncidentRunState,
  IncidentScenario,
  Panel,
} from "@/types";

export const panelCosts: Partial<
  Record<Panel, number>
> = {
  logs: 5,
  traces: 5,
  deploys: 3,
  database: 15,
  cache: 10,
  queues: 10,
  dependencies: 5,
  terminal: 5,
};

export function createRun(
  scenario: IncidentScenario,
): IncidentRunState {
  return {
    scenarioId: scenario.id,
    status: "alert",
    simulatedTime: 0,
    impact: scenario.impactStart,
    danger: 0,
    evidence: [],
    hypotheses: [],
    actions: [],
    notes: "",
    panel: "overview",
    selectedServiceId:
      scenario.rootCause.componentId,
    paused: false,
    verified: false,
    hintsUsed: [],
    startedAt: new Date().toISOString(),
  };
}

function impactRate(
  scenario: IncidentScenario,
  run: IncidentRunState,
) {
  let rate =
    scenario.impactPerMinute *
    (1 + run.danger * 0.35);

  if (
    run.activeAction &&
    run.mitigationStartedAt !== undefined
  ) {
    const total =
      run.activeAction.endsAt -
      run.activeAction.startAt;

    const done =
      run.simulatedTime -
      run.activeAction.startAt;

    const progress = Math.min(
      1,
      Math.max(0, done / total),
    );

    rate *= Math.max(
      0.08,
      1 - progress * 0.92,
    );
  }

  if (
    run.status === "verifying" ||
    run.status === "recovered"
  ) {
    rate = 0;
  }

  return rate;
}

export function advanceRun(
  scenario: IncidentScenario,
  run: IncidentRunState,
  seconds: number,
) {
  const rate = impactRate(
    scenario,
    run,
  );

  return {
    ...run,
    simulatedTime:
      run.simulatedTime + seconds,
    impact:
      run.impact +
      Math.round(
        (rate * seconds) / 60,
      ),
  };
}
