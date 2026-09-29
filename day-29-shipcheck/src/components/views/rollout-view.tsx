"use client";

import { useState } from "react";
import {
  KeyRound,
  RotateCcw,
  Route,
  ScanLine,
} from "lucide-react";
import type { ReleaseSession } from "@/types/release";
import { EnvironmentPanel } from "@/components/rollout/environment-panel";
import { RolloutPanel } from "@/components/rollout/rollout-panel";
import { RollbackPanel } from "@/components/rollout/rollback-panel";
import { PreviewPanel } from "@/components/rollout/preview-panel";

type Tab =
  | "environment"
  | "rollout"
  | "rollback"
  | "preview";

export function RolloutView({
  session,
}: {
  session: ReleaseSession;
}) {
  const [tab, setTab] =
    useState<Tab>("environment");

  const items = [
    {
      id: "environment" as const,
      label: "ENVIRONMENT",
      icon: KeyRound,
    },
    {
      id: "rollout" as const,
      label: "ROLLOUT",
      icon: Route,
    },
    {
      id: "rollback" as const,
      label: "RECOVERY",
      icon: RotateCcw,
    },
    {
      id: "preview" as const,
      label: "PREVIEW",
      icon: ScanLine,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl p-5 md:p-8 lg:p-10">
      <p className="font-mono text-[10px] tracking-[0.12em] text-neutral-400">
        RELEASE EXECUTION
      </p>

      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em]">
        ROLLOUT
        <br />
        PLAN.
      </h1>

      <div className="mt-8 flex overflow-x-auto border-b border-neutral-200 dark:border-neutral-800">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-[10px] font-semibold ${
              tab === item.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-neutral-400"
            }`}
          >
            <item.icon size={13} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-7">
        {tab === "environment" && (
          <EnvironmentPanel session={session} />
        )}

        {tab === "rollout" && (
          <RolloutPanel session={session} />
        )}

        {tab === "rollback" && (
          <RollbackPanel session={session} />
        )}

        {tab === "preview" && (
          <PreviewPanel session={session} />
        )}
      </div>
    </div>
  );
}