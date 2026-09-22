export type ReplaySpeed = 1 | 2 | 4;

export type ReplayMilestoneKind = "year-start" | "first-contribution" | "longest-streak" | "busiest-day" | "year-end";

export interface ReplayMilestone {
  kind: ReplayMilestoneKind;
  date: string;
  label: string;
  cursor: number;
}

export interface TemporalState {
  replayActive: boolean;
  replayPlaying: boolean;
  replayCursor: number;
  replaySpeed: ReplaySpeed;
  yearShift: number;
  layers: {
    ghost: boolean;
    streaks: boolean;
    differences: boolean;
  };
}
