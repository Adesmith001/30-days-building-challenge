import type { ContributionDay, ContributionLevel } from "@/types/github";

interface RawContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
  contributionLevel: ContributionLevel;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function fillCalendarYear(
  year: number,
  sourceDays: RawContributionDay[],
): ContributionDay[] {
  const source = new Map(sourceDays.map((day) => [day.date, day]));
  const today = dateKey(new Date());
  const cursor = new Date(Date.UTC(year, 0, 1, 12));
  const end = new Date(Date.UTC(year, 11, 31, 12));
  const days: ContributionDay[] = [];

  while (cursor <= end) {
    const date = dateKey(cursor);
    const existing = source.get(date);

    days.push({
      date,
      count: existing?.contributionCount ?? 0,
      weekday: existing?.weekday ?? cursor.getUTCDay(),
      level: existing?.contributionLevel ?? "NONE",
      isFuture: date > today,
    });

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}
