import type {
  IncidentRunState,
  IncidentScenario,
  ScoreBreakdown,
} from "@/types";

export function getRank(score: number) {
  if (score >= 9200) {
    return "INCIDENT COMMANDER";
  }

  if (score >= 8000) {
    return "RELIABILITY LEAD";
  }

  if (score >= 6500) {
    return "ON-CALL READY";
  }

  if (score >= 5000) {
    return "INCIDENT ENGINEER";
  }

  if (score >= 3000) {
    return "FIRST RESPONDER";
  }

  return "PANIC MODE";
}

export function calculateScore(
  scenario: IncidentScenario,
  run: IncidentRunState,
): ScoreBreakdown {
  const effectiveAt =
    run.mitigationStartedAt ?? 900;

  const mitigation = Math.max(
    600,
    Math.round(
      3000 -
        Math.max(0, effectiveAt - 60) * 4,
    ),
  );

  const submission =
    run.rootCauseSubmission;

  let rootCause = 0;

  if (
    submission?.componentId ===
    scenario.rootCause.componentId
  ) {
    rootCause += 800;
  }

  if (
    submission?.cause ===
    scenario.rootCause.cause
  ) {
    rootCause += 900;
  }

  if (
    submission?.trigger ===
    scenario.rootCause.trigger
  ) {
    rootCause += 500;
  }

  const criticalFound =
    scenario.rootCause.criticalEvidenceIds.filter(
      (id) =>
        run.evidence.some(
          (evidence) =>
            evidence.sourceId === id,
        ),
    ).length;

  const evidenceRatio =
    criticalFound /
    scenario.rootCause.criticalEvidenceIds
      .length;

  rootCause += Math.round(
    evidenceRatio * 300,
  );

  const targetImpact =
    scenario.impactStart +
    scenario.impactPerMinute * 12;

  const impactRatio = Math.max(
    0,
    1 -
      (run.impact - scenario.impactStart) /
        Math.max(
          1,
          targetImpact -
            scenario.impactStart,
        ),
  );

  const customerImpact = Math.round(
    700 + impactRatio * 1300,
  );

  const hypothesisBonus =
    run.hypotheses.length > 0 ? 300 : 0;

  const investigation = Math.min(
    1500,
    Math.round(
      evidenceRatio * 1000 +
        hypothesisBonus +
        Math.min(200, run.evidence.length * 40),
    ),
  );

  const harmful = run.actions.filter(
    (action) => action.effect === "harm",
  ).length;

  const waste = run.actions.filter(
    (action) => action.effect === "waste",
  ).length;

  const hintCost = run.hintsUsed.reduce(
    (total, level) =>
      total +
      [0, 100, 250, 500][level],
    0,
  );

  const safety = Math.max(
    0,
    1000 -
      harmful * 350 -
      waste * 90 -
      hintCost,
  );

  const total =
    mitigation +
    rootCause +
    customerImpact +
    investigation +
    safety;

  const reasons: string[] = [];

  if (criticalFound >= 2) {
    reasons.push(
      `+${criticalFound * 100} correlated ${
        criticalFound
      } critical signals`,
    );
  }

  if (
    submission?.componentId ===
      scenario.rootCause.componentId &&
    submission?.cause ===
      scenario.rootCause.cause
  ) {
    reasons.push(
      "+2500-class root cause diagnosis was correct",
    );
  }

  if (harmful > 0) {
    reasons.push(
      `-${harmful * 350} unsafe operational action`,
    );
  }

  if (waste > 0) {
    reasons.push(
      `-${waste * 90} time spent on ineffective mitigations`,
    );
  }

  if (
    run.hypotheses.length === 0
  ) {
    reasons.push(
      "Investigation lacked an explicit hypothesis",
    );
  }

  return {
    total,
    rank: getRank(total),
    mitigation,
    rootCause,
    customerImpact,
    investigation,
    safety,
    reasons,
  };
}
