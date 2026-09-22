export interface TemporalState {
  yearShift: number;
  layers: {
    ghost: boolean;
    streaks: boolean;
    differences: boolean;
  };
}
