"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage/db";
import { deriveTimerState } from "@/lib/time/derive";
import { useNow } from "@/hooks/use-now";
import { useVisibilityTracking } from "@/hooks/use-visibility-tracking";
import { useUIStore } from "@/stores/ui-store";
import { FocusTimer } from "@/components/focus/focus-timer";
import { FocusActions } from "@/components/focus/focus-actions";
import { ParkingCapture } from "@/components/focus/parking-capture";
import { CheckpointCapture } from "@/components/focus/checkpoint-capture";
import { CloseSession } from "@/components/focus/close-session";
import { TimeComplete } from "@/components/focus/time-complete";
import { ReentryScreen } from "@/components/focus/reentry-screen";
import { useSettingsStore } from "@/stores/settings-store";
import { createCheckpoint, extendSession, finishBreak, finishSession, makeSessionOpenEnded, parkThought, pauseSession, recordPlannedComplete, resumeSession, startBreak } from "@/lib/session/operations";

export default function FocusPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const now = useNow(1000);
  const session = useLiveQuery(() => db.sessions.get(id), [id]);
  const overlay = useUIStore((state) => state.overlay);
  const setOverlay = useUIStore((state) => state.setOverlay);
  const reentry = useUIStore((state) => state.reentry);
  const setReentry = useUIStore((state) => state.setReentry);
  const keepScreenAwake = useSettingsStore((state) => state.keepScreenAwake);

  useVisibilityTracking(id, Boolean(session && ["active", "paused", "break"].includes(session.status)));

  useEffect(() => {
    if (!session || session.status !== "break" || !session.breakEndsAt) return;
    if (now >= new Date(session.breakEndsAt).getTime()) void finishBreak(id);
  }, [id, now, session]);

  if (!session) return <main className="p-8 text-sm text-[var(--muted)]">Loading session…</main>;
  const timer = deriveTimerState(session, now);
  const timeComplete = session.mode === "timed" && timer.isComplete && session.status === "active";
  if (timeComplete) void recordPlannedComplete(id);

  const close = async (result: Parameters<typeof finishSession>[1], details: Parameters<typeof finishSession>[2]) => {
    await finishSession(id, result, details);
    router.replace(`/review/${id}`);
  };

  return (
    <main className="min-h-dvh p-5 md:p-10 lg:p-14">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em]">
        <Link href="/home">Deep Work OS</Link>
        <span className="mono hidden lg:inline">P PARK · C CHECKPOINT · SPACE PAUSE · D DONE · F FULLSCREEN</span>
        <span>{session.status}</span>
      </div>
      <div className="mx-auto max-w-5xl pt-[12vh]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Outcome</p>
        <h1 className="editorial mt-4 max-w-4xl text-5xl leading-[0.95] md:text-7xl">{session.outcome}</h1>
        <div className="mt-12 grid gap-8 border-y py-6 md:grid-cols-2">
          <div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Next action</p><p className="mt-2 text-lg">{session.currentNextAction}</p></div>
          <div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Definition of done</p><p className="mt-2 text-sm text-[var(--muted)]">{session.definitionOfDone}</p></div>
        </div>
        <div className="py-14"><FocusTimer session={session} {...timer} /></div>
        <FocusActions status={session.status} onPause={() => void pauseSession(id)} onResume={() => void resumeSession(id)} onCheckpoint={() => setOverlay("checkpoint")} onPark={() => setOverlay("park")} onDone={() => setOverlay("close")} onBreak={() => void startBreak(id)} />
        {timeComplete && <div className="mt-6"><TimeComplete onExtend={() => void extendSession(id, 600)} onContinue={async () => { await makeSessionOpenEnded(id); setOverlay(null); }} onClose={() => setOverlay("close")} /></div>}
        {overlay === "park" && <div className="mt-6"><ParkingCapture onCancel={() => setOverlay(null)} onSave={async (text) => { await parkThought(id, text); setOverlay(null); }} /></div>}
        {overlay === "checkpoint" && <div className="mt-6"><CheckpointCapture currentNextAction={session.currentNextAction} onCancel={() => setOverlay(null)} onSave={async (summary, nextAction) => { await createCheckpoint(id, summary, nextAction); setOverlay(null); }} /></div>}
        {overlay === "close" && <div className="mt-6"><CloseSession onCancel={() => setOverlay(null)} onClose={close} /></div>}
      </div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">{session.status === "paused" ? "Session paused." : session.status === "break" ? "Break started." : ""}</div>
      {reentry && <ReentryScreen durationMs={reentry.durationMs} onContinue={() => setReentry(null)} />}
      {keepScreenAwake ? null : null}
    </main>
  );
}
