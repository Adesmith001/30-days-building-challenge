import { deriveYearStats } from "@/lib/stats/derive-year-stats";
import type { ContributionDay, GitHubYearSnapshot, RepositoryActivity } from "@/types/github";

function dateForDay(year: number, index: number) {
  const date = new Date(Date.UTC(year, 0, index + 1, 12));

  return date.toISOString().slice(0, 10);
}

function demoDays(year: number): ContributionDay[] {
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const totalDays = isLeapYear ? 366 : 365;
  const days: ContributionDay[] = [];

  for (let index = 0; index < totalDays; index += 1) {
    const count = (index * 17) % 11 > 5 ? (index * 7) % 18 : 0;
    const date = dateForDay(year, index);

    days.push({
      date,
      count,
      weekday: new Date(`${date}T12:00:00Z`).getUTCDay(),
      level: count === 0 ? "NONE" : count > 12 ? "FOURTH_QUARTILE" : "SECOND_QUARTILE",
      isFuture: false,
    });
  }

  return days;
}

const repositories: RepositoryActivity[] = [
  ["atlas", "TypeScript", "#3178c6", 118],
  ["monorail", "Rust", "#dea584", 94],
  ["night-shift", "JavaScript", "#f1e05a", 81],
  ["field-notes", "Python", "#3572A5", 67],
  ["signal", "Go", "#00ADD8", 53],
  ["common-ground", "CSS", "#563d7c", 42],
].map(([name, language, color, commits], index) => ({
  id: `demo-${index}`,
  name: String(name),
  nameWithOwner: `demo/${String(name)}`,
  url: `https://github.com/demo/${String(name)}`,
  description: "A sample GitCity repository.",
  commitContributions: Number(commits),
  stars: 0,
  forks: 0,
  primaryLanguage: {
    name: String(language),
    color: String(color),
  },
  pushedAt: null,
}));

export function createDemoSnapshot(login: string, year: number): GitHubYearSnapshot {
  const days = demoDays(year);

  return {
    login,
    year,
    generatedAt: new Date().toISOString(),
    contributionYears: [year, year - 1, year - 2],
    profile: {
      login,
      name: "City Builder",
      avatarUrl: "https://github.com/identicons/demo.png",
      profileUrl: `https://github.com/${login}`,
      createdAt: `${year - 4}-01-01T00:00:00Z`,
    },
    days,
    repositories,
    totals: {
      contributions: days.reduce((sum, day) => sum + day.count, 0),
      commits: 420,
      pullRequests: 24,
      reviews: 38,
      issues: 11,
      repositoriesContributedTo: repositories.length,
    },
    stats: deriveYearStats(days),
  };
}
