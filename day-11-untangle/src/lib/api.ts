import type {
  AiItem,
  NextAction,
  PlanResult,
  UntangleResult,
} from "../types";

type Mode =
  | "untangle"
  | "simplify"
  | "plan"
  | "important";

interface ApiPayload {
  mode: Mode;
  text: string;
  items?: AiItem[];
}

async function post<T>(payload: ApiPayload): Promise<T> {
  const response = await fetch("/api/untangle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ?? "Something went wrong.",
    );
  }

  return data as T;
}

export function untangleText(text: string) {
  return post<UntangleResult>({
    mode: "untangle",
    text,
  });
}

export function simplifyThoughts(
  text: string,
  items: AiItem[],
) {
  return post<UntangleResult>({
    mode: "simplify",
    text,
    items,
  });
}

export function buildPlan(
  text: string,
  items: AiItem[],
) {
  return post<PlanResult>({
    mode: "plan",
    text,
    items,
  });
}

export function findMostImportant(
  text: string,
  items: AiItem[],
) {
  return post<NextAction>({
    mode: "important",
    text,
    items,
  });
}