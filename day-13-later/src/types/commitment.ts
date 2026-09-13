export type CommitmentStatus =
  | "waiting"
  | "due"
  | "completed";

export type RescheduleHistory = {
  from: number;
  to: number;
  changedAt: number;
};

export type Commitment = {
  id: string;
  title: string;
  createdAt: number;
  scheduledFor: number;
  originalScheduledFor: number;

  completedAt?: number;

  status: CommitmentStatus;

  postponements: number;
  history: RescheduleHistory[];
};