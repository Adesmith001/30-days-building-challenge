"use client";

import type { TimelinePoint } from "@/lib/session/timeline";

export function AttentionTimeline({ points }: { points: TimelinePoint[] }) {
  return (
    <div className="border-t">
      {points.map((point) => (
        <div key={point.id} className="grid grid-cols-[1fr_auto] gap-6 border-b py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em]">{point.label}</p>
            <p className="mt-1 text-[10px] text-[var(--muted)]">{new Date(point.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
          <span className="mono text-[10px] text-[var(--muted)]">{Math.round(point.percentage)}%</span>
        </div>
      ))}
      {!points.length && <p className="py-6 text-sm text-[var(--muted)]">No attention events yet.</p>}
    </div>
  );
}
