export type Severity = "SEV-1" | "SEV-2" | "SEV-3";

export type Difficulty =
  | "GUIDED"
  | "STANDARD"
  | "HARD";

export type IncidentStatus =
  | "alert"
  | "investigating"
  | "mitigating"
  | "verifying"
  | "recovered"
  | "root-cause"
  | "postmortem"
  | "score";

export type Panel =
  | "overview"
  | "metrics"
  | "logs"
  | "traces"
  | "deploys"
  | "database"
  | "cache"
  | "queues"
  | "flags"
  | "dependencies"
  | "timeline"
  | "evidence"
  | "hypothesis"
  | "actions"
  | "terminal";

export type AppView =
  | "landing"
  | "how"
  | "library"
  | "history"
  | "about"
  | "incident"
  | "shift-complete";

export type ServiceKind =
  | "frontend"
  | "gateway"
  | "api"
  | "worker"
  | "database"
  | "cache"
  | "queue"
  | "external";

export interface ServiceDefinition {
  id: string;
  name: string;
  kind: ServiceKind;
  version?: string;
  x: number;
  y: number;
}

export interface DependencyEdge {
  from: string;
  to: string;
}

export interface MetricConfig {
  id: string;
  label: string;
  serviceId: string;
  unit: string;
  normal: number;
  incident: number;
  noise: number;
  decimals?: number;
  evidenceLabel?: string;
}

export interface MetricPoint {
  t: number;
  time: string;
  value: number;
}

export interface LogEntry {
  id: string;
  offset: number;
  level: "INFO" | "WARN" | "ERROR";
  service: string;
  message: string;
  traceId?: string;
  evidenceLabel?: string;
}

export interface TraceSpan {
  id: string;
  service: string;
  operation: string;
  startMs: number;
  durationMs: number;
  depth: number;
  status: "ok" | "error";
  annotation?: string;
}

export interface Trace {
  id: string;
  offset: number;
  root: string;
  status: "ok" | "error";
  durationMs: number;
  spans: TraceSpan[];
  evidenceLabel?: string;
}

export interface Deployment {
  id: string;
  offset: number;
  serviceId: string;
  version: string;
  commit: string;
  summary: string;
  evidenceLabel?: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  rollout: number;
  changedOffset: number;
}

export interface DiagnosticStat {
  label: string;
  value: string;
  state?: "normal" | "warning" | "critical";
}

export interface DiagnosticPanel {
  title: string;
  subtitle?: string;
  note?: string;
  stats: DiagnosticStat[];
  evidenceId?: string;
  evidenceLabel?: string;
}

export interface ScenarioEvent {
  id: string;
  offset: number;
  label: string;
  detail?: string;
  kind:
    | "normal"
    | "change"
    | "warning"
    | "alert"
    | "system";
}

export interface ActionDefinition {
  id: string;
  label: string;
  target: string;
  costSeconds: number;
  potential: string;
  consequence: string;
  effect: "mitigate" | "waste" | "harm";
  dangerDelta?: number;
}

export interface RootCauseDefinition {
  componentId: string;
  cause: string;
  trigger: string;
  summary: string;
  criticalEvidenceIds: string[];
}

export interface AlertDefinition {
  title: string;
  metric: string;
  current: string;
  baseline: string;
  startedAgo: string;
  affected: string;
  region: string;
  customerText: string;
}

export interface PostmortemDefinition {
  contributingFactors: string[];
  followUps: string[];
  mitigation: string;
}

export interface IncidentScenario {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  skill: string;
  severity: Severity;
  difficulty: Difficulty;
  region: string;
  startClock: string;
  degradeAt: number;
  seed: number;
  impactStart: number;
  impactPerMinute: number;
  alert: AlertDefinition;
  services: ServiceDefinition[];
  dependencies: DependencyEdge[];
  metrics: MetricConfig[];
  logs: LogEntry[];
  traces: Trace[];
  deploys: Deployment[];
  flags: FeatureFlag[];
  tools: {
    database: DiagnosticPanel;
    cache: DiagnosticPanel;
    queues: DiagnosticPanel;
    dependencies: DiagnosticPanel;
  };
  events: ScenarioEvent[];
  actions: ActionDefinition[];
  rootCause: RootCauseDefinition;
  hints: string[];
  postmortem: PostmortemDefinition;
}

export interface EvidencePin {
  id: string;
  sourceId: string;
  kind:
    | "metric"
    | "log"
    | "trace"
    | "deploy"
    | "database"
    | "cache"
    | "queue"
    | "dependency"
    | "flag";
  label: string;
  at: number;
}

export interface Hypothesis {
  id: string;
  componentId: string;
  cause: string;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  evidenceIds: string[];
  at: number;
}

export interface ExecutedAction {
  id: string;
  actionId: string;
  label: string;
  effect: ActionDefinition["effect"];
  consequence: string;
  at: number;
}

export interface ActiveAction {
  actionId: string;
  label: string;
  startAt: number;
  endsAt: number;
}

export interface RootCauseSubmission {
  componentId: string;
  cause: string;
  trigger: string;
  notes: string;
}

export interface ScoreBreakdown {
  total: number;
  rank: string;
  mitigation: number;
  rootCause: number;
  customerImpact: number;
  investigation: number;
  safety: number;
  reasons: string[];
}

export interface IncidentRunState {
  scenarioId: string;
  status: IncidentStatus;
  simulatedTime: number;
  impact: number;
  danger: number;
  evidence: EvidencePin[];
  hypotheses: Hypothesis[];
  actions: ExecutedAction[];
  notes: string;
  panel: Panel;
  selectedServiceId?: string;
  paused: boolean;
  activeAction?: ActiveAction;
  mitigationStartedAt?: number;
  recoveryAt?: number;
  verified: boolean;
  rootCauseSubmission?: RootCauseSubmission;
  hintsUsed: number[];
  finalScore?: ScoreBreakdown;
  startedAt: string;
}

export interface HistoryRecord {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  completedAt: string;
  score: number;
  rank: string;
  recoveryTime: number;
  impact: number;
}
