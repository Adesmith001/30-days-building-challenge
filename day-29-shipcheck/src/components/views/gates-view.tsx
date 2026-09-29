"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  ChevronRight,
  UserRound,
} from "lucide-react";
import type {
  ReleaseGate,
  ReleaseSession,
} from "@/types/release";
import { GateStatusBadge } from "@/components/ui/status";
import { GateDrawer } from "@/components/gates/gate-drawer";
import { satisfiedGateCount } from "@/lib/analysis/readiness";

export function GatesView({
  session,
}: {
  session: ReleaseSession;
}) {
  const [selected, setSelected] =
    useState<ReleaseGate | null>(null);

  const [filter, setFilter] = useState<
    "all" | "attention" | "passed"
  >("all");

  const counts = satisfiedGateCount(session.gates);

  const gates = useMemo(() => {
    if (filter === "attention") {
      return session.gates.filter((gate) =>
        ["pending", "fail", "blocked"].includes(
          gate.status,
        ),
      );
    }

    if (filter === "passed") {
      return session.gates.filter((gate) =>
        ["pass", "waived"].includes(gate.status),
      );
    }

    return session.gates;
  }, [session.gates, filter]);

  return (
    <div className="mx-auto max-w-5xl p-5 md:p-8 lg:p-10">
      <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400">
        RELEASE REQUIREMENTS
      </p>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
        <h1 className="text-4xl font-semibold tracking-[-0.055em]">
          RELEASE
          <br />
          GATES.
        </h1>

        <div className="text-right">
          <p className="text-3xl font-semibold tracking-[-0.05em]">
            {counts.satisfied} / {counts.total}
          </p>

          <p className="mt-1 font-mono text-[9px] tracking-[0.1em] text-neutral-400">
            REQUIRED GATES SATISFIED
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
        {(["all", "attention", "passed"] as const).map(
          (item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`border-b-2 px-4 py-3 text-[10px] font-semibold tracking-[0.08em] ${
                filter === item
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-neutral-400"
              }`}
            >
              {item.toUpperCase()}
            </button>
          ),
        )}
      </div>

      <div className="divide-y divide-neutral-200 border-b border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
        {gates.map((gate) => (
          <button
            key={gate.id}
            onClick={() => setSelected(gate)}
            className="grid w-full grid-cols-[28px_1fr_auto_auto] items-center gap-3 py-4 text-left"
          >
            {gate.type === "automated" ? (
              <Bot
                size={15}
                className="text-neutral-400"
              />
            ) : (
              <UserRound
                size={15}
                className="text-neutral-400"
              />
            )}

            <div>
              <p className="text-sm font-semibold">
                {gate.title}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                {gate.category} ·{" "}
                {gate.type.toUpperCase()}
              </p>
            </div>

            <GateStatusBadge status={gate.status} />

            <ChevronRight
              size={14}
              className="text-neutral-400"
            />
          </button>
        ))}
      </div>

      {selected && (
        <GateDrawer
          gate={
            session.gates.find(
              (gate) => gate.id === selected.id,
            ) ?? selected
          }
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}