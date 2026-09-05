import type { Project } from "../data/projects";

export const TOTAL_DAYS = 30;
const ONE_DAY = 24 * 60 * 60 * 1000;

export type DaySlot =
  | { day: number; status: "completed"; project: Project }
  | { day: number; status: "up-next" | "today" | "locked"; project?: never };

export const padDay = (day: number) => String(day).padStart(2, "0");

export function getChallengeDay(challengeStartDate: string) {
  const start = new Date(`${challengeStartDate}T00:00:00`);
  const now = new Date();
  const elapsed = Math.floor((now.getTime() - start.getTime()) / ONE_DAY) + 1;

  if (elapsed < 1) return 1;
  return Math.min(elapsed, TOTAL_DAYS);
}

export function buildSlots(projects: Project[], currentDay: number, challengeStartDate: string): DaySlot[] {
  return Array.from({ length: TOTAL_DAYS }, (_, index) => {
    const day = index + 1;
    const project = projects.find((item) => item.day === day);

    if (project) return { day, status: "completed", project };

    if (day === currentDay) {
      const start = new Date(`${challengeStartDate}T00:00:00`);
      return { day, status: Date.now() < start.getTime() ? "up-next" : "today" };
    }

    return { day, status: "locked" };
  });
}
