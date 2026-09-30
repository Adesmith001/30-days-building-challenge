"use client";

import { useState } from "react";

export function ParkingCapture({
  onSave,
  onCancel,
}: {
  onSave: (text: string) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [text, setText] = useState("");

  return (
    <div className="border bg-[var(--surface)] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em]">Park a thought</p>
      <textarea autoFocus value={text} onChange={(event) => setText(event.target.value)} placeholder="Capture it and return to the work." className="mt-5 min-h-28 w-full resize-y border-b bg-transparent py-3 outline-none" />
      <div className="mt-5 flex justify-end gap-4">
        <button className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em]" onClick={onCancel}>Cancel</button>
        <button disabled={!text.trim()} className="bg-[var(--foreground)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--background)] disabled:opacity-40" onClick={() => void onSave(text)}>Park</button>
      </div>
    </div>
  );
}
