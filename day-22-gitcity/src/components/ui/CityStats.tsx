import type { GitHubYearSnapshot } from "@/types/github";

export function CityStats({ snapshot }: { snapshot: GitHubYearSnapshot }) {
  const stats = [
    ["CONTRIBUTIONS", snapshot.stats.totalContributions.toLocaleString()],
    ["ACTIVE DAYS", snapshot.stats.activeDays.toLocaleString()],
    ["LONGEST STREAK", `${snapshot.stats.longestStreak} DAYS`],
    ["REPOSITORIES", snapshot.repositories.length.toString().padStart(2, "0")],
  ];

  return (
    <div className="grid grid-cols-2 border border-[var(--line)] bg-[#111419]/90 sm:grid-cols-4">
      {stats.map(([label, value]) => (
        <div key={label} className="border-r border-b border-[var(--line)] px-4 py-3 last:border-r-0 sm:border-b-0">
          <div className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.16em] text-[var(--muted)]">{label}</div>
          <div className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--text)]">{value}</div>
        </div>
      ))}
    </div>
  );
}
