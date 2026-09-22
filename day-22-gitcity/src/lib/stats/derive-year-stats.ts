import type { ContributionDay, DerivedYearStats } from "@/types/github";

export function deriveYearStats(days: ContributionDay[]): DerivedYearStats {
  const observed = days.filter((day) => !day.isFuture);
  let activeDays = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let busiestDay: DerivedYearStats["busiestDay"] = null;
  const monthTotals = new Map<number, number>();

  for (const day of observed) {
    if (day.count > 0) {
      activeDays += 1;
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    if (day.count > 0 && (!busiestDay || day.count > busiestDay.count)) {
      busiestDay = {
        date: day.date,
        count: day.count,
      };
    }

    const month = Number(day.date.slice(5, 7));
    monthTotals.set(month, (monthTotals.get(month) ?? 0) + day.count);
  }

  let busiestMonth: DerivedYearStats["busiestMonth"] = null;

  for (const [month, count] of monthTotals.entries()) {
    if (count > 0 && (!busiestMonth || count > busiestMonth.count)) {
      busiestMonth = {
        month,
        count,
      };
    }
  }

  const totalContributions = observed.reduce(
    (sum, day) => sum + day.count,
    0,
  );

  return {
    totalContributions,
    activeDays,
    longestStreak,
    busiestDay,
    busiestMonth,
  };
}
