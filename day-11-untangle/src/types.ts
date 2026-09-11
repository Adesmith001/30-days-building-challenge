export type Category =
  | "now"
  | "soon"
  | "later"
  | "ideas"
  | "let_go";

export type ItemKind = "task" | "idea" | "thought";

export interface SafetyResult {
  requiresSupport: boolean;
  message: string;
}

export interface NextAction {
  itemId: string;
  title: string;
  reason: string;
}

export interface AiItem {
  id: string;
  title: string;
  category: Category;
  kind: ItemKind;
  reason: string;
  metadata: string;
  estimateMinutes: number;
}

export interface UntangleResult {
  summary: string;
  nextAction: NextAction;
  items: AiItem[];
  safety: SafetyResult;
}

export interface SessionItem extends AiItem {
  completed: boolean;
  released: boolean;
}

export interface PlanStep {
  itemId: string;
  title: string;
  reason: string;
  estimateMinutes: number;
}

export interface PlanResult {
  intro: string;
  steps: PlanStep[];
}

export interface Session {
  id: string;
  createdAt: string;
  updatedAt: string;
  rawText: string;
  summary: string;
  nextAction: NextAction;
  items: SessionItem[];
  plan?: PlanStep[];
}