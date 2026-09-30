"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage/db";

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const session = useLiveQuery(() => db.sessions.get(id), [id]);
  if (!session) return <main className="p-8 text-sm text-[var(--muted)]">Loading session…</main>;
  return <main className="min-h-dvh p-5 md:p-10 lg:p-14"><Link href="/sessions" className="text-[10px] font-bold uppercase tracking-[0.18em]">← Sessions</Link><div className="mx-auto max-w-4xl pt-16"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{session.status}</p><h1 className="editorial mt-5 text-6xl leading-none md:text-8xl">{session.outcome}</h1><div className="mt-12 grid gap-8 border-y py-6 md:grid-cols-2"><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Done means</p><p className="mt-2">{session.definitionOfDone}</p></div><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Final next step</p><p className="mt-2">{session.finalNextStep || session.currentNextAction}</p></div></div>{session.status !== "completed" && <Link href={`/focus/${id}`} className="mt-8 inline-block bg-[var(--foreground)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--background)]">Return to focus</Link>}</div></main>;
}
