"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect } from "react";

import type { GitHubYearSnapshot } from "@/types/github";
import { deriveReplayMilestones } from "@/lib/stats/replay-milestones";
import { temporalStore, useTemporalStore } from "@/stores/temporal-store";

export function ReplayControls({ snapshot }: { snapshot: GitHubYearSnapshot }) {
  const active = useTemporalStore((value) => value.replayActive);
  const playing = useTemporalStore((value) => value.replayPlaying);
  const cursor = useTemporalStore((value) => value.replayCursor);
  const speed = useTemporalStore((value) => value.replaySpeed);
  const milestones = deriveReplayMilestones(snapshot.year, snapshot.stats.busiestDay, snapshot.stats.longestStreak);
  const maxCursor = Math.max(1, snapshot.days.length - 1);

  useEffect(() => {
    if (!active || !playing) {
      return;
    }

    const timer = window.setInterval(() => {
      const next = cursor + speed;

      if (next >= maxCursor) {
        temporalStore.setReplayCursor(maxCursor);
        temporalStore.setReplayPlaying(false);
        return;
      }

      temporalStore.setReplayCursor(next);
    }, 80);

    return () => window.clearInterval(timer);
  }, [active, cursor, maxCursor, playing, speed]);

  return (
    <div className="pointer-events-auto border border-[var(--line)] bg-[#111419]/95 p-3 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <span className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.16em] text-[var(--mint)]">YEAR REPLAY</span>
        <button type="button" onClick={() => active ? temporalStore.endReplay() : temporalStore.beginReplay()} className="text-[var(--muted)] hover:text-white">{active ? <RotateCcw size={13} /> : <Play size={13} />}</button>
        {active && <button type="button" onClick={() => temporalStore.setReplayPlaying(!playing)} className="text-[var(--muted)] hover:text-white">{playing ? <Pause size={13} /> : <Play size={13} />}</button>}
      </div>
      {active && <>
        <input type="range" min="0" max={maxCursor} value={cursor} onChange={(event) => temporalStore.setReplayCursor(Number(event.target.value))} className="mt-3 w-full accent-[var(--mint)]" />
        <div className="mt-2 flex items-center justify-between font-[family-name:var(--font-mono)] text-[8px] text-[var(--muted)]"><span>{snapshot.days[Math.min(cursor, snapshot.days.length - 1)]?.date}</span><select value={speed} onChange={(event) => temporalStore.setReplaySpeed(Number(event.target.value) as 1 | 2 | 4)} className="bg-transparent text-[var(--mint)] outline-none"><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option></select></div>
        <div className="mt-3 flex gap-1">{milestones.map((milestone) => <button key={milestone.kind} type="button" title={milestone.label} onClick={() => temporalStore.setReplayCursor(Math.round((milestone.cursor / 4) * maxCursor))} className="h-1 flex-1 bg-[var(--line)] hover:bg-[var(--mint)]" />)}</div>
      </>}
    </div>
  );
}
