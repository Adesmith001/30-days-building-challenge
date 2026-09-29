"use client";

import { useState } from "react";
import {
  ArrowRight,
  Link as LinkIcon,
  X,
} from "lucide-react";
import type { ReleaseGate } from "@/types/release";
import { GateStatusBadge } from "@/components/ui/status";
import { Button } from "@/components/ui/button";
import { useReleaseStore } from "@/stores/release-store";

export function GateDrawer({
  gate,
  onClose,
}: {
  gate: ReleaseGate;
  onClose: () => void;
}) {
  const addEvidence = useReleaseStore(
    (store) => store.addEvidence,
  );

  const waive = useReleaseStore(
    (store) => store.waiveGate,
  );

  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [waiving, setWaiving] = useState(false);
  const [reason, setReason] = useState("");

  function complete() {
    if (!note.trim() && !url.trim()) return;

    addEvidence(gate.id, {
      id: crypto.randomUUID(),
      type: url ? "link" : "note",
      text: note || "Evidence link supplied.",
      url: url || undefined,
      by: "ADESMITH",
      timestamp: new Date().toISOString(),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/25">
      <div className="absolute inset-y-0 right-0 w-full max-w-xl overflow-auto border-l border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950 md:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400">
              {gate.type.toUpperCase()} ·{" "}
              {gate.category}
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
              {gate.title}
            </h2>

            <div className="mt-3">
              <GateStatusBadge status={gate.status} />
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <Section title="WHY THIS EXISTS">
          <p>{gate.why}</p>
        </Section>

        <Section title="WHAT TO VERIFY">
          <div className="space-y-3">
            {gate.verify.map((item) => (
              <div
                key={item}
                className="flex gap-3 text-sm"
              >
                <ArrowRight
                  size={13}
                  className="mt-1 shrink-0 text-neutral-400"
                />
                {item}
              </div>
            ))}
          </div>
        </Section>

        <Section title="EVIDENCE">
          {gate.evidence.length ? (
            <div className="space-y-3">
              {gate.evidence.map((item) => (
                <div
                  key={item.id}
                  className="border border-neutral-200 p-4 dark:border-neutral-800"
                >
                  <p className="text-sm">
                    {item.text}
                  </p>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 flex items-center gap-1 text-xs text-blue-600"
                    >
                      <LinkIcon size={11} />
                      {item.url}
                    </a>
                  )}

                  <p className="mt-3 font-mono text-[9px] text-neutral-400">
                    {item.by} ·{" "}
                    {new Date(
                      item.timestamp,
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">
              No evidence yet.
            </p>
          )}
        </Section>

        {gate.type === "human" &&
          gate.status !== "pass" &&
          gate.status !== "waived" && (
            <Section title="ADD EVIDENCE">
              <textarea
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                placeholder="What did you verify?"
                className="h-28 w-full resize-none border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
              />

              <input
                value={url}
                onChange={(event) =>
                  setUrl(event.target.value)
                }
                placeholder="Optional evidence URL"
                className="mt-2 h-10 w-full border border-neutral-300 bg-transparent px-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
              />

              <Button
                className="mt-3 w-full"
                disabled={!note.trim() && !url.trim()}
                onClick={complete}
              >
                ADD EVIDENCE & MARK REVIEWED
              </Button>
            </Section>
          )}

        {gate.required &&
          gate.status !== "pass" &&
          gate.status !== "waived" && (
            <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
              {!waiving ? (
                <Button
                  variant="quiet"
                  onClick={() => setWaiving(true)}
                >
                  WAIVE GATE
                </Button>
              ) : (
                <div>
                  <p className="text-sm font-semibold">
                    WAIVE REQUIRED GATE?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    A waiver is not a pass. The reason,
                    author and timestamp remain visible in
                    the release packet.
                  </p>

                  <textarea
                    value={reason}
                    onChange={(event) =>
                      setReason(event.target.value)
                    }
                    placeholder="Reason required"
                    className="mt-4 h-24 w-full resize-none border border-amber-300 bg-amber-50 p-3 text-sm outline-none dark:border-amber-900 dark:bg-amber-950/20"
                  />

                  <Button
                    variant="secondary"
                    className="mt-3"
                    disabled={!reason.trim()}
                    onClick={() => {
                      waive(gate.id, reason);
                      onClose();
                    }}
                  >
                    CONFIRM WAIVER
                  </Button>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
      <h3 className="mb-4 font-mono text-[9px] font-semibold tracking-[0.14em] text-neutral-400">
        {title}
      </h3>

      <div className="text-sm leading-6">
        {children}
      </div>
    </section>
  );
}