"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { CityModel } from "@/types/city";
import type { GitHubYearSnapshot } from "@/types/github";
import { sceneStore } from "@/stores/scene-store";

export function CitySearch({ snapshot, city, onSelect }: { snapshot: GitHubYearSnapshot; city: CityModel; onSelect?: () => void }) {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return [];
    }

    return [
      ...snapshot.repositories.filter((repository) => repository.name.toLowerCase().includes(value)).map((repository) => ({ id: repository.id, label: repository.name, type: "REPOSITORY" })),
      ...city.lots.filter((lot) => lot.date.includes(value)).slice(0, 3).map((lot) => ({ id: lot.id, label: lot.date, type: "DAY" })),
    ].slice(0, 5);
  }, [city.lots, query, snapshot.repositories]);

  return (
    <div className="pointer-events-auto relative w-full md:w-64">
      <div className="flex items-center border border-[var(--line)] bg-[#111419]/95 px-3 py-2 backdrop-blur-xl">
        <Search size={13} className="text-[var(--muted)]" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH CITY" className="ml-2 min-w-0 flex-1 bg-transparent font-[family-name:var(--font-mono)] text-[9px] tracking-[0.12em] text-white outline-none placeholder:text-[var(--muted)]" />
      </div>
      {matches.length > 0 && <div className="absolute left-0 right-0 top-10 border border-[var(--line)] bg-[#111419] p-1 shadow-2xl">{matches.map((match) => <button key={match.id} type="button" onClick={() => { sceneStore.selectLot(match.id); setQuery(match.label); onSelect?.(); }} className="flex min-h-11 w-full items-center justify-between px-2 py-2 text-left font-[family-name:var(--font-mono)] text-[8px] tracking-[0.1em] text-white hover:bg-[var(--surface-high)]"><span>{match.label}</span><span className="text-[var(--muted)]">{match.type}</span></button>)}</div>}
    </div>
  );
}
