import type { ContributionDay } from "@/types/github";

export function getLongestStreakDates(days: ContributionDay[]) {
  let current: string[] = [];
  let longest: string[] = [];

  for (const day of days) {
    if (day.count > 0 && !day.isFuture) {
      current = [...current, day.date];

      if (current.length > longest.length) {
        longest = current;
      }
    } else {
      current = [];
    }
  }

  return longest;
}
