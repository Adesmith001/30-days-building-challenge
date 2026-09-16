export type CommuteMode =
  | "Car"
  | "Bus"
  | "BRT"
  | "Train"
  | "Bike"
  | "Walk"
  | "Mixed";

export interface WorkRoutine {
  workDaysPerWeek: number;
  remoteDaysPerWeek: number;
  workWeeksPerYear: number;
}

export interface HomeOption {
  id: "a" | "b";
  name: string;
  annualRent: number;
  oneWayMinutes: number;
  oneWayTransportCost: number;
  mode: CommuteMode;
}

export interface ComparisonDraft {
  routine: WorkRoutine;
  homeA: HomeOption;
  homeB: HomeOption;
}

export interface ComparisonPrefs {
  valueTimeEnabled: boolean;
  hourlyValue: number;
}

export interface HomeMetrics {
  commuteDaysPerWeek: number;
  annualCommuteDays: number;

  annualTransportCost: number;
  annualCashCost: number;

  monthlyRentEquivalent: number;
  monthlyTransportEquivalent: number;
  monthlyCashEquivalent: number;

  annualCommuteHours: number;
  commuteDayEquivalent: number;
  weeklyCommuteHours: number;
}

export interface ComparisonMetrics {
  homeA: HomeMetrics;
  homeB: HomeMetrics;

  rentSavingsB: number;
  extraTransportB: number;
  cashSavingsB: number;

  extraHoursB: number;
  extraCommuteDaysB: number;

  breakEvenRentB: number;
  timeBreakEvenHourly: number | null;
}

export interface SavedComparison {
  id: string;
  draft: ComparisonDraft;
  prefs: ComparisonPrefs;
  savedAt: string;
}