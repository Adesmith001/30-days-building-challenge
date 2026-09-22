import type { ReplayMilestone } from "@/types/temporal";

export function deriveReplayMilestones(
  year: number,
  busiestDay: { date: string; count: number } | null,
  longestStreak: number,
): ReplayMilestone[] {
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;
  const busiestDate = busiestDay?.date ?? yearStart;

  return [
    { kind: "year-start", date: yearStart, label: "YEAR START", cursor: 0 },
    { kind: "first-contribution", date: yearStart, label: "FIRST CONTRIBUTION", cursor: 1 },
    { kind: "longest-streak", date: yearStart, label: `${longestStreak} DAY STREAK`, cursor: 2 },
    { kind: "busiest-day", date: busiestDate, label: `${busiestDay?.count ?? 0} CONTRIBUTIONS`, cursor: 3 },
    { kind: "year-end", date: yearEnd, label: "YEAR COMPLETE", cursor: 4 },
  ];
}
