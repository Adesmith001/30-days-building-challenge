"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage/db";

export default function PatternsPage() {
  const sessions = useLiveQuery(() => db.sessions.filter((session) => session.status === "completed").toArray()) ?? [];
  const results = sessions.reduce<Record<string, number>>((counts, session) => { const key = session.resultStatus ?? "unknown"; counts[key] = (counts[key] ?? 0) + 1; return counts; }, {});
  return <main className="min-h-dvh p-5 md:p-10 lg:p-14"><h1 className="editorial text-6xl leading-none md:text-8xl">Patterns</h1><p className="mt-5 max-w-xl text-sm text-[var(--muted)]">A quiet summary of how your sessions actually end. No score, streak, or leaderboard.</p><div className="mt-16 max-w-2xl border-t">{Object.entries(results).map(([result, count]) => <div key={result} className="flex justify-between border-b py-5 text-xs font-bold uppercase tracking-[0.14em]"><span>{result.replace("_", " ")}</span><span className="mono text-[var(--muted)]">{count}</span></div>)}{!sessions.length && <p className="py-8 text-sm text-[var(--muted)]">Complete a session to see a pattern.</p>}</div></main>;
}
