"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage/db";

export default function SessionsPage() {
  const sessions = useLiveQuery(() => db.sessions.orderBy("createdAt").reverse().toArray()) ?? [];
  return <main className="min-h-dvh p-5 md:p-10 lg:p-14"><h1 className="editorial text-6xl leading-none md:text-8xl">Sessions</h1><p className="mt-5 max-w-xl text-sm text-[var(--muted)]">A record of the work you chose to protect.</p><div className="mt-16 border-t">{sessions.map((session) => <Link key={session.id} href={session.status === "completed" ? `/review/${session.id}` : `/focus/${session.id}`} className="grid gap-3 border-b py-6 md:grid-cols-[1fr_auto]"><div><p className="text-lg">{session.outcome}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{session.status} · {new Date(session.createdAt).toLocaleDateString()}</p></div><span className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">Open →</span></Link>)}{!sessions.length && <p className="py-8 text-sm text-[var(--muted)]">No sessions yet.</p>}</div></main>;
}
