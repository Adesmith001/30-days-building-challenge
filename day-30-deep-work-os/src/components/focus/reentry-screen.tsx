"use client";

export function ReentryScreen({
  durationMs,
  onContinue,
}: {
  durationMs: number;
  onContinue: () => void;
}) {
  const minutes = Math.max(1, Math.round(durationMs / 60_000));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--background)] p-6">
      <div className="max-w-xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">Re-entry</p>
        <h1 className="editorial mt-6 text-6xl leading-none md:text-8xl">You were away for {minutes} minutes.</h1>
        <p className="mt-6 text-sm text-[var(--muted)]">The session is still here. Read the outcome and next action, then continue when you are ready.</p>
        <button onClick={onContinue} className="mt-10 bg-[var(--foreground)] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--background)]">Return to work</button>
      </div>
    </div>
  );
}
