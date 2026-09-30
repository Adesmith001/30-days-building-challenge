"use client";

export function FocusActions({
  status,
  onPause,
  onResume,
  onCheckpoint,
  onPark,
  onDone,
  onBreak,
}: {
  status: string;
  onPause: () => void;
  onResume: () => void;
  onCheckpoint: () => void;
  onPark: () => void;
  onDone: () => void;
  onBreak: () => void;
}) {
  const paused = status === "paused";

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
      <button className="border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em]" onClick={paused ? onResume : onPause}>
        {paused ? "Resume" : "Pause"}
      </button>
      <button className="border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em]" onClick={onCheckpoint}>Checkpoint</button>
      <button className="border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em]" onClick={onPark}>Park thought</button>
      <button className="border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em]" onClick={onBreak}>Break</button>
      <button className="bg-[var(--foreground)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--background)]" onClick={onDone}>Close session</button>
    </div>
  );
}
