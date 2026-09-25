import type {
  IncidentRunState,
  IncidentScenario,
} from "@/types";

export interface TimelineItem {
  id: string;
  at: number;
  label: string;
  detail?: string;
  kind:
    | "normal"
    | "change"
    | "warning"
    | "alert"
    | "system"
    | "player";
}

export function buildTimeline(
  scenario: IncidentScenario,
  run: IncidentRunState,
): TimelineItem[] {
  const scenarioItems: TimelineItem[] =
    scenario.events.map((event) => ({
      id: event.id,
      at: event.offset,
      label: event.label,
      detail: event.detail,
      kind: event.kind,
    }));

  const evidence = run.evidence.map(
    (item) => ({
      id: `e-${item.id}`,
      at: item.at,
      label: "EVIDENCE PINNED",
      detail: item.label,
      kind: "player" as const,
    }),
  );

  const hypotheses = run.hypotheses.map(
    (item, index) => ({
      id: `h-${item.id}`,
      at: item.at,
      label: `HYPOTHESIS H${index + 1}`,
      detail: item.cause,
      kind: "player" as const,
    }),
  );

  const actions = run.actions.map((item) => ({
    id: `a-${item.id}`,
    at: item.at,
    label: item.label,
    detail: item.consequence,
    kind: "player" as const,
  }));

  return [
    ...scenarioItems,
    ...evidence,
    ...hypotheses,
    ...actions,
  ].sort((a, b) => a.at - b.at);
}
