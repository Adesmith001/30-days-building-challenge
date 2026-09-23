export const interviewStages = [
  "understand",
  "define_constraints",
  "estimate_scale",
  "define_data",
  "define_core_flow",
  "challenge_components",
  "failure_testing",
  "security_operations",
  "tradeoff_review",
  "wrap_up",
] as const;

export type InterviewStage =
  (typeof interviewStages)[number];

export type AssumptionStatus =
  | "unverified"
  | "confirmed"
  | "unresolved"
  | "rejected";

export interface Assumption {
  id: string;
  statement: string;
  status: AssumptionStatus;
  evidence?: string;
}

export interface ArchitectureDecision {
  id: string;
  decision: string;
  reason?: string;
  tradeoff?: string;
  status: "current" | "reconsidering" | "replaced";
}

export interface ArchitectureRisk {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  resolved: boolean;
}

export interface ArchitectureContradiction {
  id: string;
  earlierStatement: string;
  laterStatement: string;
  question: string;
  resolved: boolean;
}

export interface ScaleEstimate {
  dailyUsers?: number;
  concurrentUsers?: number;
  averageRps?: number;
  peakRps?: number;
  readWriteRatio?: string;
  geographicScope?: string;
}

export interface InterviewState {
  stage: InterviewStage;
  systemName?: string;
  problemStatement?: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  assumptions: Assumption[];
  decisions: ArchitectureDecision[];
  unresolvedQuestions: string[];
  risks: ArchitectureRisk[];
  constraints: string[];
  scale: ScaleEstimate;
  discussedTopics: string[];
  contradictions: ArchitectureContradiction[];
}
