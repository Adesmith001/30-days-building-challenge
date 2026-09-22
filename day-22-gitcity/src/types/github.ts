export type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  profileUrl: string;
  createdAt: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  weekday: number;
  level: ContributionLevel;
  isFuture: boolean;
}

export interface RepositoryActivity {
  id: string;
  name: string;
  nameWithOwner: string;
  url: string;
  description: string | null;
  commitContributions: number;
  stars: number;
  forks: number;
  primaryLanguage: {
    name: string;
    color: string | null;
  } | null;
  pushedAt: string | null;
}

export interface ContributionTotals {
  contributions: number;
  commits: number;
  pullRequests: number;
  reviews: number;
  issues: number;
  repositoriesContributedTo: number;
}

export interface DerivedYearStats {
  totalContributions: number;
  activeDays: number;
  longestStreak: number;
  busiestDay: {
    date: string;
    count: number;
  } | null;
  busiestMonth: {
    month: number;
    count: number;
  } | null;
}

export interface GitHubYearSnapshot {
  login: string;
  year: number;
  generatedAt: string;
  contributionYears: number[];
  profile: GitHubProfile;
  days: ContributionDay[];
  repositories: RepositoryActivity[];
  totals: ContributionTotals;
  stats: DerivedYearStats;
}
