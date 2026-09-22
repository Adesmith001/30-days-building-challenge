import { fillCalendarYear } from "./fill-calendar";
import { createDemoSnapshot } from "./demo-snapshot";
import { deriveYearStats } from "@/lib/stats/derive-year-stats";
import type { ContributionLevel, GitHubYearSnapshot } from "@/types/github";

const query = `
  query GitCityYear($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      login name avatarUrl url createdAt
      contributionsCollection(from: $from, to: $to) {
        contributionYears
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date weekday contributionCount contributionLevel } }
        }
        totalCommitContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalIssueContributions
        commitContributionsByRepository(maxRepositories: 8) {
          contributions { totalCount }
          repository { id name nameWithOwner url description stargazerCount forkCount pushedAt primaryLanguage { name color } }
        }
      }
    }
  }
`;

export async function fetchGitHubYear(login: string, year: number): Promise<GitHubYearSnapshot> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return createDemoSnapshot(login, year);
  }

  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login, from, to },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub responded with ${response.status}.`);
  }

  const payload = await response.json();
  const user = payload.data?.user;

  if (!user) {
    throw new Error("GitHub user was not found.");
  }

  const collection = user.contributionsCollection;
  const sourceDays = collection.contributionCalendar.weeks.flatMap((week: { contributionDays: unknown[] }) => week.contributionDays) as Array<{
    date: string;
    contributionCount: number;
    weekday: number;
    contributionLevel: ContributionLevel;
  }>;
  const days = fillCalendarYear(year, sourceDays);
  const repositories = collection.commitContributionsByRepository.map((item: any) => ({
    id: item.repository.id,
    name: item.repository.name,
    nameWithOwner: item.repository.nameWithOwner,
    url: item.repository.url,
    description: item.repository.description,
    commitContributions: item.contributions.totalCount,
    stars: item.repository.stargazerCount,
    forks: item.repository.forkCount,
    primaryLanguage: item.repository.primaryLanguage,
    pushedAt: item.repository.pushedAt,
  }));

  return {
    login: user.login,
    year,
    generatedAt: new Date().toISOString(),
    contributionYears: collection.contributionYears,
    profile: {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      profileUrl: user.url,
      createdAt: user.createdAt,
    },
    days,
    repositories,
    totals: {
      contributions: collection.contributionCalendar.totalContributions,
      commits: collection.totalCommitContributions,
      pullRequests: collection.totalPullRequestContributions,
      reviews: collection.totalPullRequestReviewContributions,
      issues: collection.totalIssueContributions,
      repositoriesContributedTo: repositories.length,
    },
    stats: deriveYearStats(days),
  };
}
