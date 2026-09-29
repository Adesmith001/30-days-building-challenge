export type ImpactArea =
  | "FRONTEND"
  | "API"
  | "DATABASE"
  | "AUTH"
  | "PAYMENTS"
  | "CONFIG"
  | "DEPENDENCIES"
  | "INFRA"
  | "TESTS"
  | "OBSERVABILITY";

export type GateStatus =
  | "pending"
  | "pass"
  | "fail"
  | "blocked"
  | "waived";

export type ReleaseState =
  | "BLOCKED"
  | "NEEDS_REVIEW"
  | "READY_TO_SHIP"
  | "READY_WITH_WAIVERS";

export type EvidenceType =
  | "note"
  | "link"
  | "confirmation"
  | "automated";

export interface ChangedFile {
  path: string;
  status: "added" | "modified" | "deleted" | "renamed";
  additions: number;
  deletions: number;
  patch?: string;
  areas: ImpactArea[];
}

export interface Finding {
  id: string;
  detectorId: string;
  category: ImpactArea | "RELEASE";
  severity: "info" | "review" | "blocker";
  title: string;
  description: string;
  sourcePaths: string[];
}

export interface GateEvidence {
  id: string;
  type: EvidenceType;
  text: string;
  url?: string;
  by: string;
  timestamp: string;
}

export interface ReleaseGate {
  id: string;
  type: "automated" | "human";
  category: ImpactArea | "CI" | "ROLLOUT" | "ROLLBACK" | "PREVIEW";
  title: string;
  description: string;
  why: string;
  verify: string[];
  required: boolean;
  status: GateStatus;
  evidence: GateEvidence[];
  sourceFindingIds: string[];
}

export interface CiCheck {
  id: string;
  name: string;
  status: "pass" | "fail" | "pending";
  required: boolean;
  url?: string;
}

export type EnvironmentStatus =
  | "confirmed"
  | "missing"
  | "not_verified";

export interface EnvironmentReference {
  key: string;
  local: EnvironmentStatus;
  preview: EnvironmentStatus;
  production: EnvironmentStatus;
}

export interface RolloutPlan {
  strategy: "all-at-once" | "feature-flag" | "canary" | "phased" | "manual";
  initialExposure: string;
  stages: string;
  stopConditions: string;
  owner: string;
}

export interface RollbackPlan {
  strategy: "rollback" | "forward-fix" | "both";
  reversibleSurface: string;
  recoveryApproach: string;
  dataConsiderations: string;
  trigger: string;
}

export interface SmokeCheck {
  id: string;
  path: string;
  expectedStatus: number;
  status: "pending" | "pass" | "fail";
  actualStatus?: number;
  durationMs?: number;
}

export interface VerificationItem {
  id: string;
  title: string;
  status: "pending" | "pass";
  note?: string;
}

export interface ReleaseDelta {
  addedFiles: string[];
  newAreas: ImpactArea[];
  addedGateIds: string[];
  preservedGateIds: string[];
}

export interface ReleaseSource {
  kind: "github-pr" | "pasted-diff" | "demo";
  url?: string;
  prNumber?: number;
}

export interface ReleaseSession {
  id: string;
  title: string;
  repository: string;
  source: ReleaseSource;
  baseSha?: string;
  headSha?: string;
  latestHeadSha?: string;
  outdated: boolean;
  createdAt: string;
  updatedAt: string;
  changedFiles: ChangedFile[];
  findings: Finding[];
  gates: ReleaseGate[];
  ci: CiCheck[];
  environments: EnvironmentReference[];
  rollout: RolloutPlan;
  rollback: RollbackPlan;
  previewUrl: string;
  smokeChecks: SmokeCheck[];
  verificationStartedAt?: string;
  verification: VerificationItem[];
  delta?: ReleaseDelta;
}