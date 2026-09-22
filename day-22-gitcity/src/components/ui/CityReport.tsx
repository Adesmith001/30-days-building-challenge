import type { GitHubYearSnapshot } from "@/types/github";

export function CityReport({ snapshot, previousSnapshot }: { snapshot: GitHubYearSnapshot; previousSnapshot: GitHubYearSnapshot }) {
  const contributionDelta = snapshot.stats.totalContributions - previousSnapshot.stats.totalContributions;
  const activeDayDelta = snapshot.stats.activeDays - previousSnapshot.stats.activeDays;
  const direction = contributionDelta >= 0 ? "UP" : "DOWN";

  return (
    <aside className="pointer-events-auto border border-[var(--line)] bg-[#111419]/95 p-4 backdrop-blur-xl">
      <div className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.18em] text-[var(--gold)]">CITY REPORT // YEAR SHIFT</div>
      <div className="mt-3 grid grid-cols-2 gap-3 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.12em] text-[var(--muted)]">
        <div><div>CONTRIBUTIONS</div><div className={`mt-1 text-sm ${contributionDelta >= 0 ? "text-[var(--mint)]" : "text-[#f56f7b]"}`}>{direction} {Math.abs(contributionDelta).toLocaleString()}</div></div>
        <div><div>ACTIVE DAYS</div><div className="mt-1 text-sm text-white">{activeDayDelta >= 0 ? "+" : ""}{activeDayDelta}</div></div>
      </div>
      <div className="mt-4 border-t border-[var(--line-soft)] pt-3 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.12em] text-[var(--muted)]">{previousSnapshot.year} → {snapshot.year} · SAME LOT GRID</div>
    </aside>
  );
}
