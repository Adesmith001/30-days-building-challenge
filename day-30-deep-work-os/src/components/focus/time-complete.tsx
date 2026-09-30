"use client";

export function TimeComplete({
  onExtend,
  onContinue,
  onClose,
}: {
  onExtend: () => void | Promise<void>;
  onContinue: () => void | Promise<void>;
  onClose: () => void;
}) {
  return (
    <div className="border bg-[var(--surface)] p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em]">Planned time complete</p>
      <p className="mt-4 text-lg">The timebox ended. The work does not have to.</p>
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        <button onClick={() => void onExtend()} className="border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em]">+10 minutes</button>
        <button onClick={() => void onContinue()} className="border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em]">Continue open-ended</button>
        <button onClick={onClose} className="bg-[var(--foreground)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--background)]">Close session</button>
      </div>
    </div>
  );
}
