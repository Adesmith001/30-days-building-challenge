export type SalaryPeriod = "annual" | "monthly";
export type Currency = "NGN" | "USD" | "GBP" | "EUR";
export type AppScreen = "setup" | "live" | "summary" | "history";

export interface WorkSettings {
  daysPerWeek: number;
  hoursPerDay: number;
  weeksPerYear: number;
}

export interface Attendee {
  id: string;
  role: string;
  salary: number;
  salaryPeriod: SalaryPeriod;
  quantity: number;
  joinedAtMs: number;
  leftAtMs: number | null;
  active: boolean;
}

export interface AttendeeDraft {
  role: string;
  salary: number;
  salaryPeriod: SalaryPeriod;
  quantity: number;
}

export interface EfficiencyAnswers {
  decisionMade: boolean;
  clearAgenda: boolean;
  everyoneNeeded: boolean;
}

export interface MeetingRecord {
  id: string;
  name: string;
  startedAtISO: string;
  endedAtISO: string;
  durationMs: number;
  attendees: Attendee[];
  totalCost: number;
  currency: Currency;
  workSettings: WorkSettings;
  efficiency?: EfficiencyAnswers;
}