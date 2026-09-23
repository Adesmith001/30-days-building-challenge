import type {
  InterviewState,
} from "@/types/interview";

import type {
  StateExtraction,
} from "@/lib/ai/schemas";

function normalize(
  value: string,
) {
  return value
    .trim()
    .toLowerCase();
}

function uniqueStrings(
  oldItems: string[],
  newItems: string[],
) {
  const map =
    new Map<string, string>();

  for (const item of [
    ...oldItems,
    ...newItems,
  ]) {
    map.set(
      normalize(item),
      item.trim(),
    );
  }

  return [
    ...map.values(),
  ];
}

export function mergeInterviewState(
  current: InterviewState,
  update: StateExtraction,
): InterviewState {
  const assumptions =
    [...current.assumptions];

  for (
    const incoming
    of update.assumptions
  ) {
    const index =
      assumptions.findIndex(
        (item) =>
          normalize(
            item.statement,
          ) ===
          normalize(
            incoming.statement,
          ),
      );

    const next = {
      id:
        index >= 0
          ? assumptions[index].id
          : crypto.randomUUID(),

      statement:
        incoming.statement,

      status:
        incoming.status,

      evidence:
        incoming.evidence ??
        undefined,
    };

    if (index >= 0) {
      assumptions[index] = next;
    } else {
      assumptions.push(next);
    }
  }

  const decisions =
    [...current.decisions];

  for (
    const incoming
    of update.decisions
  ) {
    const index =
      decisions.findIndex(
        (item) =>
          normalize(
            item.decision,
          ) ===
          normalize(
            incoming.decision,
          ),
      );

    const next = {
      id:
        index >= 0
          ? decisions[index].id
          : crypto.randomUUID(),

      decision:
        incoming.decision,

      reason:
        incoming.reason ??
        undefined,

      tradeoff:
        incoming.tradeoff ??
        undefined,

      status:
        incoming.status,
    };

    if (index >= 0) {
      decisions[index] = next;
    } else {
      decisions.push(next);
    }
  }

  const risks =
    [...current.risks];

  for (
    const incoming
    of update.risks
  ) {
    const index =
      risks.findIndex(
        (item) =>
          normalize(
            item.title,
          ) ===
          normalize(
            incoming.title,
          ),
      );

    const next = {
      id:
        index >= 0
          ? risks[index].id
          : crypto.randomUUID(),

      ...incoming,
    };

    if (index >= 0) {
      risks[index] = next;
    } else {
      risks.push(next);
    }
  }

  const contradictions =
    [...current.contradictions];

  for (
    const incoming
    of update.contradictions
  ) {
    const key =
      normalize(
        incoming.earlierStatement +
        incoming.laterStatement,
      );

    const index =
      contradictions.findIndex(
        (item) =>
          normalize(
            item.earlierStatement +
            item.laterStatement,
          ) === key,
      );

    const next = {
      id:
        index >= 0
          ? contradictions[index].id
          : crypto.randomUUID(),

      ...incoming,
    };

    if (index >= 0) {
      contradictions[index] =
        next;
    } else {
      contradictions.push(next);
    }
  }

  return {
    ...current,

    stage:
      update.stage,

    systemName:
      update.systemName ??
      current.systemName,

    problemStatement:
      update.problemStatement ??
      current.problemStatement,

    functionalRequirements:
      uniqueStrings(
        current.functionalRequirements,
        update.functionalRequirements,
      ),

    nonFunctionalRequirements:
      uniqueStrings(
        current.nonFunctionalRequirements,
        update.nonFunctionalRequirements,
      ),

    constraints:
      uniqueStrings(
        current.constraints,
        update.constraints,
      ),

    unresolvedQuestions:
      update.unresolvedQuestions,

    discussedTopics:
      uniqueStrings(
        current.discussedTopics,
        update.discussedTopics,
      ),

    assumptions,
    decisions,
    risks,
    contradictions,

    scale: {
      ...current.scale,

      ...(update.scale.dailyUsers !==
      null
        ? {
            dailyUsers:
              update.scale.dailyUsers,
          }
        : {}),

      ...(update.scale.concurrentUsers !==
      null
        ? {
            concurrentUsers:
              update.scale.concurrentUsers,
          }
        : {}),

      ...(update.scale.averageRps !==
      null
        ? {
            averageRps:
              update.scale.averageRps,
          }
        : {}),

      ...(update.scale.peakRps !==
      null
        ? {
            peakRps:
              update.scale.peakRps,
          }
        : {}),

      ...(update.scale.readWriteRatio
        ? {
            readWriteRatio:
              update.scale.readWriteRatio,
          }
        : {}),

      ...(update.scale.geographicScope
        ? {
            geographicScope:
              update.scale.geographicScope,
          }
        : {}),
    },
  };
}
