"use client";

import { useState } from "react";
import type {
  ReleaseSession,
  RollbackPlan,
} from "@/types/release";
import { Button } from "@/components/ui/button";
import { useReleaseStore } from "@/stores/release-store";

export function RollbackPanel({
  session,
}: {
  session: ReleaseSession;
}) {
  const save = useReleaseStore(
    (store) => store.saveRollback,
  );

  const [plan, setPlan] = useState(session.rollback);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof RollbackPlan>(
    key: K,
    value: RollbackPlan[K],
  ) {
    setSaved(false);

    setPlan((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-semibold tracking-[-0.055em]">
        IF THIS GOES
        <br />
        WRONG.
      </h2>

      <div className="mt-7 flex gap-2">
        {(["rollback", "forward-fix", "both"] as const).map(
          (strategy) => (
            <button
              key={strategy}
              onClick={() =>
                update("strategy", strategy)
              }
              className={`border px-3 py-2 text-[10px] font-semibold ${
                plan.strategy === strategy
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/20"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {strategy
                .replace("-", " ")
                .toUpperCase()}
            </button>
          ),
        )}
      </div>

      <div className="mt-7 space-y-5">
        <TextField
          label="WHAT CAN BE REVERTED?"
          value={plan.reversibleSurface}
          placeholder="Application version."
          onChange={(value) =>
            update("reversibleSurface", value)
          }
        />

        <TextField
          label="HOW?"
          value={plan.recoveryApproach}
          placeholder="Redeploy previous production commit."
          onChange={(value) =>
            update("recoveryApproach", value)
          }
        />

        <TextField
          label="DATA CONSIDERATIONS"
          value={plan.dataConsiderations}
          placeholder="Migration remains backward compatible."
          onChange={(value) =>
            update("dataConsiderations", value)
          }
        />

        <TextField
          label="TRIGGER"
          value={plan.trigger}
          placeholder="Error rate exceeds rollout stop condition."
          onChange={(value) =>
            update("trigger", value)
          }
        />
      </div>

      <Button
        className="mt-6"
        disabled={
          !plan.recoveryApproach.trim() ||
          !plan.trigger.trim()
        }
        onClick={() => {
          save(plan);
          setSaved(true);
        }}
      >
        {saved ? "PLAN SAVED" : "SAVE RECOVERY PLAN"}
      </Button>
    </div>
  );
}

function TextField({
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
    <label className="block">
      <span className="font-mono text-[9px] font-semibold tracking-[0.12em] text-neutral-400">
        {label}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-20 w-full resize-none border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-blue-500 dark:border-neutral-700"
      />
    </label>
  );
}