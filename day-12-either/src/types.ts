export type Category = "Food" | "Tech" | "Work" | "General";

export type DecisionOption = {
  id: string;
  label: string;
};

export type Comparison = {
  id: string;
  leftId: string;
  rightId: string;
  winnerId: string | null;
  createdAt: number;
};

export type Decision = {
  id: string;
  title: string;
  category: Category;
  options: DecisionOption[];
  comparisons: Comparison[];
  ranking?: string[];
  createdAt: number;
  completedAt?: number;
};

export type SortState = {
  runs: string[][];
  nextRuns: string[][];
  runIndex: number;
  leftIndex: number;
  rightIndex: number;
  merged: string[];
  done: boolean;
  ranking: string[];
};

export type SessionSnapshot = {
  sorter: SortState;
  comparisons: Comparison[];
};

export type DecisionSession = {
  decisionId: string;
  sorter: SortState;
  comparisons: Comparison[];
  undoStack: SessionSnapshot[];
};

export type NewDecisionDraft = {
  title: string;
};