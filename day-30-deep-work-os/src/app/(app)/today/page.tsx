"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage/db";
import { localDateKey, uid } from "@/lib/utils";

export default function TodayPage() {
  const plan = useLiveQuery(() => db.dailyPlans.where("date").equals(localDateKey()).first());
  const [outcome, setOutcome] = useState("");
  async function add() { if (!outcome.trim()) return; const now = new Date().toISOString(); const next = plan ?? { id: uid(), date: localDateKey(), items: [], createdAt: now, updatedAt: now }; await db.dailyPlans.put({ ...next, items: [...next.items, { id: uid(), outcome: outcome.trim() }], updatedAt: now }); setOutcome(""); }
  return <main className="min-h-dvh p-5 md:p-10 lg:p-14"><h1 className="editorial text-6xl leading-none md:text-8xl">Today</h1><p className="mt-5 text-sm text-[var(--muted)]">Choose what deserves your full attention.</p><div className="mt-16 flex max-w-2xl gap-3"><input value={outcome} onChange={(event) => setOutcome(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void add(); }} placeholder="Add one outcome" className="min-w-0 flex-1 border-b bg-transparent py-3 outline-none" /><button onClick={() => void add()} className="bg-[var(--foreground)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--background)]">Add</button></div><div className="mt-10 max-w-2xl border-t">{plan?.items.map((item, index) => <div key={item.id} className="grid grid-cols-[44px_1fr] border-b py-5"><span className="mono text-xs text-[var(--muted)]">0{index + 1}</span><p>{item.outcome}</p></div>)}</div></main>;
}
