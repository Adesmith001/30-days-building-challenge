"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import type { SessionFormValue } from "./session-form";

export function SessionContract({
  value,
  onBack,
  onConfirm,
}: {
  value: SessionFormValue;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const rows = [
    ["Outcome", value.outcome],
    ["Done when", value.definitionOfDone],
    ["First action", value.firstAction],
    [
      "Session",
      value.mode === "open"
        ? "Open session"
        : `${value.duration} min`,
    ],
    [
      "Not doing",
      value.notDoing || "Not specified",
    ],
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
        Before you begin
      </p>

      <h1 className="editorial mt-5 text-6xl leading-[0.9] md:text-8xl">
        Session
        <br />
        contract.
      </h1>

      <div className="mt-14 border-t">
        {rows.map(([label, text]) => (
          <div
            key={label}
            className="grid gap-2 border-b py-5 md:grid-cols-[160px_1fr]"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              {label}
            </span>

            <p className="text-lg">
              {text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          onClick={onConfirm}
          className="flex min-w-56 items-center justify-between bg-[var(--foreground)] px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--background)]"
        >
          Continue
          <ArrowRight size={15} />
        </button>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-[0.16em]"
        >
          <ArrowLeft size={14} />
          Edit
        </button>
      </div>
    </div>
  );
}