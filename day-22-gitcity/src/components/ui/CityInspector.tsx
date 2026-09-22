import type { GitHubYearSnapshot } from "@/types/github";

export function CityInspector({ snapshot }: { snapshot: GitHubYearSnapshot }) {
  const busiest = snapshot.stats.busiestDay;

  return (
    <aside className="border border-[var(--line)] bg-[#111419]/95 p-4 backdrop-blur-xl">
      <div className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.18em] text-[var(--mint)]">CITY HALL // PROFILE</div>
      <div className="mt-4 flex items-center gap-3">
        <img src={snapshot.profile.avatarUrl} alt="" className="h-10 w-10 border border-[var(--line)] object-cover" />
        <div>
          <div className="font-[family-name:var(--font-display)] text-lg">{snapshot.profile.name ?? snapshot.login}</div>
          <div className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--muted)]">@{snapshot.login} · {snapshot.year}</div>
        </div>
      </div>
      <div className="mt-5 border-t border-[var(--line-soft)] pt-4 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">
        <div className="flex justify-between"><span>BUSIEST DAY</span><span className="text-[var(--gold)]">{busiest?.date ?? "—"}</span></div>
        <div className="mt-2 flex justify-between"><span>PEAK OUTPUT</span><span className="text-[var(--mint)]">{busiest?.count ?? 0} CONTRIBUTIONS</span></div>
        <div className="mt-2 flex justify-between"><span>LANDMARKS</span><span className="text-white">{snapshot.repositories.length}</span></div>
      </div>
    </aside>
  );
}
