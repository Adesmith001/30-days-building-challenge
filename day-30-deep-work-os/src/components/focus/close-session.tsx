"use client";

import { useState } from "react";
import type { ResultStatus } from "@/types";

export function CloseSession({
  onClose,
  onCancel,
}: {
  onClose: (result: ResultStatus, details: { completionNote?: string; finalNextStep?: string; blocker?: string; directionChange?: string }) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [result, setResult] = useState<ResultStatus>("done");
  const [note, setNote] = useState("");

  return (
    <div className="border bg-[var(--surface)] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em]">Close session</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {(["done", "partial", "blocked", "changed_direction"] as ResultStatus[]).map((option) => (
          <button key={option} onClick={() => setResult(option)} className={`border px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] ${result === option ? "bg-[var(--accent-soft)]" : ""}`}>
            {option.replace("_", " ")}
          </button>
        ))}
      </div>
      <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What should you remember?" className="mt-5 min-h-24 w-full resize-y border-b bg-transparent py-3 outline-none" />
      <div className="mt-5 flex justify-end gap-4">
        <button className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em]" onClick={onCancel}>Cancel</button>
        <button className="bg-[var(--foreground)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--background)]" onClick={() => void onClose(result, { completionNote: note })}>Finish</button>
      </div>
    </div>
  );
}
