"use client";

import { useState } from "react";
import type {
  ReleaseSession,
  RolloutPlan,
} from "@/types/release";
import { Button } from "@/components/ui/button";
import { useReleaseStore } from "@/stores/release-store";

const strategies: Array<{
  value: RolloutPlan["strategy"];
  label: string;
}> = [
  {
    value: "all-at-once",
    label: "ALL AT ONCE",
  },
  {
    value: "feature-flag",
    label: "FEATURE FLAG",
  },
  {
    value: "canary",
    label: "CANARY",
  },
  {
    value: "phased",
    label: "PHASED",
  },
  {
    value: "manual",
    label: "MANUAL",
  },
];

export function RolloutPanel({
  session,
}: {
  session: ReleaseSession;
}) {
  const save = useReleaseStore(
    (state) => state.saveRollout,
  );

  const [plan, setPlan] = useState(session.rollout);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof RolloutPlan>(
    key: K,
    value: RolloutPlan[K],
  ) {
    setSaved(false);
    setPlan((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="max-w-3xl">
      <FieldLabel>STRATEGY</FieldLabel>

      <div className="mt-3 flex flex-wrap gap-2">
        {strategies.map((strategy) => (
          <button
            key={strategy.value}
            onClick={() =>
              update("strategy", strategy.value)
            }
            className={`border px-3 py-2 text-[10px] font-semibold ${
              plan.strategy === strategy.value
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/20"
                : "border-neutral-300 dark:border-neutral-700"
            }`}
          >
            {strategy.label}
          </button>
        ))}
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Field
          label="INITIAL EXPOSURE"
          value={plan.initialExposure}
          placeholder="5%"
          onChange={(value) =>
            update("initialExposure", value)
          }
        />

        <Field
          label="THEN"
          value={plan.stages}
          placeholder="25% → 50% → 100%"
          onChange={(value) => update("stages", value)}
        />
      </div>

      <div className="mt-5">
        <FieldLabel>STOP CONDITIONS</FieldLabel>

        <textarea
          value={plan.stopConditions}
          onChange={(event) =>
            update("stopConditions", event.target.value)
          }
          placeholder={`checkout success < 98%
payment error rate > 2%
p95 checkout latency > 1.5s`}
          className="mt-2 h-32 w-full resize-none border border-neutral-300 bg-transparent p-3 font-mono text-xs leading-6 outline-none focus:border-blue-500 dark:border-neutral-700"
        />
      </div>

      <div className="mt-5">
        <Field
          label="OWNER"
          value={plan.owner}
          placeholder="Optional"
          onChange={(value) => update("owner", value)}
        />
      </div>

      <Button
        className="mt-6"
        disabled={!plan.stopConditions.trim()}
        onClick={() => {
          save(plan);
          setSaved(true);
        }}
      >
        {saved ? "PLAN SAVED" : "SAVE ROLLOUT PLAN"}
      </Button>

      <p className="mt-4 text-xs text-neutral-400">
        ShipCheck records rollout intent. It does not
        control your feature flag or deployment system.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <FieldLabel>{label}</FieldLabel>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-11 w-full border border-neutral-300 bg-transparent px-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
      />
    </label>
  );
}

function FieldLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="font-mono text-[9px] font-semibold tracking-[0.12em] text-neutral-400">
      {children}
    </span>
  );
}