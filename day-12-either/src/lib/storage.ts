import type {
  Decision,
  DecisionSession,
  NewDecisionDraft,
} from "../types";

const DECISIONS_KEY =
  "either:decisions:v1";

const DRAFT_KEY =
  "either:new-decision:v1";

function sessionKey(id: string) {
  return `either:session:${id}`;
}

function parseValue<T>(
  value: string | null,
  fallback: T,
): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getDecisions() {
  const decisions = parseValue<Decision[]>(
    localStorage.getItem(DECISIONS_KEY),
    [],
  );

  return decisions.sort(
    (first, second) =>
      (second.completedAt ??
        second.createdAt) -
      (first.completedAt ??
        first.createdAt),
  );
}

export function saveDecisions(
  decisions: Decision[],
) {
  localStorage.setItem(
    DECISIONS_KEY,
    JSON.stringify(decisions),
  );
}

export function getDecision(
  id: string,
) {
  return getDecisions().find(
    (decision) => decision.id === id,
  );
}

export function saveDecision(
  decision: Decision,
) {
  const decisions = getDecisions();

  const existingIndex =
    decisions.findIndex(
      (item) => item.id === decision.id,
    );

  if (existingIndex >= 0) {
    decisions[existingIndex] = decision;
  } else {
    decisions.unshift(decision);
  }

  saveDecisions(decisions);

  return decision;
}

export function updateDecision(
  id: string,
  patch: Partial<Decision>,
) {
  const existing = getDecision(id);

  if (!existing) {
    return undefined;
  }

  const updated: Decision = {
    ...existing,
    ...patch,
  };

  saveDecision(updated);

  return updated;
}

export function getNewDecisionDraft() {
  return parseValue<NewDecisionDraft | null>(
    localStorage.getItem(DRAFT_KEY),
    null,
  );
}

export function saveNewDecisionDraft(
  draft: NewDecisionDraft,
) {
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify(draft),
  );
}

export function clearNewDecisionDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export function getSession(id: string) {
  return parseValue<DecisionSession | null>(
    localStorage.getItem(sessionKey(id)),
    null,
  );
}

export function saveSession(
  session: DecisionSession,
) {
  localStorage.setItem(
    sessionKey(session.decisionId),
    JSON.stringify(session),
  );
}

export function clearSession(id: string) {
  localStorage.removeItem(sessionKey(id));
}