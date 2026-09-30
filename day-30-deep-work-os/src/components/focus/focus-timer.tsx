"use client";

import type { DeepWorkSession } from "@/types";
import { formatClock } from "@/lib/time/format";

export function FocusTimer({
  session,
  remainingMs,
  overtimeMs,
  activeElapsedMs,
}: {
  session: DeepWorkSession;
  remainingMs: number | null;
  overtimeMs: number;
  activeElapsedMs: number;
}) {
  const value =
    session.mode === "open"
      ? formatClock(activeElapsedMs)
      : remainingMs !== null && remainingMs >= 0
        ? formatClock(remainingMs)
        : `+${formatClock(overtimeMs)}`;

  return (
    <div aria-label="Session timer" className="text-center">
      <p className="mono text-[clamp(4rem,15vw,11rem)] leading-none tracking-[-0.08em]">
        {value}
      </p>
      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
        {session.mode === "open" ? "Open ended" : session.status}
      </p>
    </div>
  );
}
