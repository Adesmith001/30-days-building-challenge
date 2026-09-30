export type SessionStatus =
  | "draft"
  | "preparing"
  | "active"
  | "paused"
  | "break"
  | "completed"
  | "abandoned";

export type ResultStatus =
  | "done"
  | "partial"
  | "blocked"
  | "changed_direction";

export type SessionMode = "timed" | "open";

export type SessionEventType =
  | "SESSION_STARTED"
  | "CHECKPOINT_CREATED"
  | "THOUGHT_PARKED"
  | "VISIBILITY_HIDDEN"
  | "VISIBILITY_VISIBLE"
  | "INTERRUPTION_LABELED"
  | "PAUSED"
  | "RESUMED"
  | "BREAK_STARTED"
  | "BREAK_ENDED"
  | "NEXT_ACTION_CHANGED"
  | "PLANNED_TIME_COMPLETED"
  | "PLANNED_TIME_EXTENDED"
  | "SESSION_COMPLETED"
  | "SESSION_ABANDONED";

export interface SessionResource {
  id: string;
  type: "link" | "note";
  label: string;
  value: string;
}

export interface DeepWorkSession {
  id: string;
  projectId?: string | null;
  continuedFromSessionId?: string | null;

  outcome: string;
  definitionOfDone: string;
  firstAction: string;
  currentNextAction: string;
  notDoing?: string;

  resources: SessionResource[];

  mode: SessionMode;
  plannedDurationSeconds?: number | null;

  status: SessionStatus;
  resultStatus?: ResultStatus | null;

  startedAt?: string | null;
  endedAt?: string | null;

  pauseStartedAt?: string | null;
  breakStartedAt?: string | null;
  breakEndsAt?: string | null;

  totalPausedMs: number;
  totalBreakMs: number;

  completionNote?: string;
  finalNextStep?: string;
  blocker?: string;
  directionChange?: string;

  createdAt: string;
  updatedAt: string;
}

export interface SessionEvent {
  id: string;
  sessionId: string;
  type: SessionEventType;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SessionCheckpoint {
  id: string;
  sessionId: string;
  summary: string;
  nextAction: string;
  createdAt: string;
}

export interface ParkedItem {
  id: string;
  sessionId: string;
  text: string;
  createdAt: string;
  resolved: boolean;
}

export interface Project {
  id: string;
  name: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyPlanItem {
  id: string;
  outcome: string;
  projectId?: string;
  sourceSessionId?: string;
}

export interface DailyPlan {
  id: string;
  date: string;
  items: DailyPlanItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ReentryState {
  hiddenAt: string;
  returnedAt: string;
  durationMs: number;
}
