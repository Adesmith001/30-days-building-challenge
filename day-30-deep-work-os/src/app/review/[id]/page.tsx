"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage/db";
import { buildTimeline } from "@/lib/session/timeline";
import { AttentionTimeline } from "@/components/review/attention-timeline";
import { ParkingReview } from "@/components/review/parking-review";

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const data = useLiveQuery(async () => {
    const session = await db.sessions.get(id);
    const [events, parked] = await Promise.all([db.sessionEvents.where("sessionId").equals(id).toArray(), db.parkedItems.where("sessionId").equals(id).toArray()]);
    return { session, events, parked };
  }, [id]);
  if (!data?.session) return <main className="p-8 text-sm text-[var(--muted)]">Loading review…</main>;
  return <main className="min-h-dvh p-5 md:p-10 lg:p-14"><div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.18em]"><Link href="/home">Deep Work OS</Link><Link href={`/sessions/${id}`}>Session detail</Link></div><div className="mx-auto max-w-5xl pt-16"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Session closed</p><h1 className="editorial mt-5 max-w-4xl text-6xl leading-none md:text-8xl">{data.session.outcome}</h1><p className="mt-6 text-sm uppercase tracking-[0.14em] text-[var(--muted)]">{data.session.resultStatus?.replace("_", " ")}</p><section className="mt-20"><h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em]">Attention timeline</h2><AttentionTimeline points={buildTimeline(data.events)} /></section><section className="mt-16"><h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em]">Parking lot</h2><ParkingReview items={data.parked} /></section></div></main>;
}
