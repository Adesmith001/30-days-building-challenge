import type {
  QuestionType,
  ReasoningStage,
} from "./ai";

export type ProblemMode =
  | "general"
  | "decision"
  | "learn"
  | "troubleshoot"
  | "improve"
  | "code";

export type SessionStatus =
  | "active"
  | "paused"
  | "resolved";

export interface QuestionCard {
  text: string;
  type: QuestionType;
}

export interface ThreadTurn {
  id: string;

  question: string;
  type: QuestionType;

  answer: string;

  note?: string;

  createdAt: number;
}

export interface ReasoningNode {
  label: string;
  text: string;
}

export interface DuckSession {
  id: string;
  title: string;

  mode: ProblemMode;

  problem: string;
  tried: string;
  outcome: string;

  status: SessionStatus;

  createdAt: number;
  updatedAt: number;

  stage: ReasoningStage;

  clarity: number;
  previousClarity?: number;

  questionCount: number;

  hintLevel: number;

  currentQuestion?: QuestionCard;
  activeHint?: string;

  progressNote?: string;

  reasoningSummary: string;

  turns: ThreadTurn[];

  insights: string[];
  assumptions: string[];
  evidence: string[];

  tryThis?: string;

  directExplanation?: string;

  conclusion?: string;

  resolutionStatus?:
    | "almost"
    | "needs-evidence"
    | "resolved";

  reasoningMap: ReasoningNode[];
}