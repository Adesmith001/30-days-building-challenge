"use client";

import { useState } from "react";

export function CheckpointCapture({
  currentNextAction,
  onSave,
  onCancel,
}: {
  currentNextAction: string;
  onSave: (summary: string, nextAction: string) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [summary, setSummary] = useState("");
  const [nextAction, setNextAction] = useState(currentNextAction);

  return (
    <div className="border bg-[var(--surface)] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em]">Save checkpoint</p>
      <textarea autoFocus value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="What changed or became clear?" className="mt-5 min-h-24 w-full resize-y border-b bg-transparent py-3 outline-none" />
      <input value={nextAction} onChange={(event) => setNextAction(event.target.value)} placeholder="The next visible action" className="mt-5 w-full border-b bg-transparent py-3 outline-none" />
      <div className="mt-5 flex justify-end gap-4">
        <button className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em]" onClick={onCancel}>Cancel</button>
        <button disabled={!summary.trim() || !nextAction.trim()} className="bg-[var(--foreground)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--background)] disabled:opacity-40" onClick={() => void onSave(summary, nextAction)}>Save</button>
      </div>
    </div>
  );
}
