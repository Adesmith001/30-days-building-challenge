import { createId } from "../lib/ids";
import type {
  Attendee,
  WorkSettings,
} from "../types/meeting";

export const DEFAULT_WORK_SETTINGS: WorkSettings = {
  daysPerWeek: 5,
  hoursPerDay: 8,
  weeksPerYear: 52,
};

const roles = [
  ["Software Engineer", 12_000_000, 3],
  ["Product Manager", 18_000_000, 1],
  ["Engineering Manager", 24_000_000, 1],
  ["Designer", 9_500_000, 2],
  ["QA Tester", 6_000_000, 1],
] as const;

export function createDefaultAttendees(): Attendee[] {
  return roles.map(([role, salary, quantity]) => ({
    id: createId(),
    role,
    salary,
    quantity,
    salaryPeriod: "annual",
    joinedAtMs: 0,
    leftAtMs: null,
    active: true,
  }));
}

export function createEmptyAttendee(): Attendee {
  return {
    id: createId(),
    role: "",
    salary: 0,
    quantity: 1,
    salaryPeriod: "annual",
    joinedAtMs: 0,
    leftAtMs: null,
    active: true,
  };
}