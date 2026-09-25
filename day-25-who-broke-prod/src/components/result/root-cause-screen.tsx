import {
  FormEvent,
  useState,
} from "react";
import { ArrowRight } from "lucide-react";
import { getScenario } from "@/data/incidents";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/use-game-store";

const causes = [
  "deployment regression",
  "connection lifecycle regression",
  "cache stampede",
  "poison message retry loop",
  "third-party provider degradation",
  "memory leak",
  "database overload",
  "capacity exhaustion",
  "network degradation",
];

const triggers = [
  "v2.4.1 rollout",
  "v5.9.0 rollout",
  "simultaneous cache expiry",
  "v8.2.0 retry change",
  "provider incident",
  "v7.3.0 rollout",
  "traffic spike",
  "feature flag rollout",
];

export function RootCauseScreen() {
  const run = useGameStore(
    (state) => state.run,
  );

  const submitRootCause =
    useGameStore(
      (state) =>
        state.submitRootCause,
    );

  const [component, setComponent] =
    useState("");

  const [cause, setCause] =
    useState("");

  const [trigger, setTrigger] =
    useState("");

  const [notes, setNotes] =
    useState("");

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  function submit(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (
      !component ||
      !cause ||
      !trigger
    ) {
      return;
    }

    submitRootCause({
      componentId: component,
      cause,
      trigger,
      notes,
    });
  }

  return (
    <main className="min-h-screen bg-[#090b0d] p-5 text-zinc-100 md:p-10">
      <section className="mx-auto max-w-4xl py-8 md:py-16">
        <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-600">
          RECOVERY VERIFIED
        </p>

        <h1 className="mt-4 text-6xl font-black leading-[0.86] tracking-[-0.06em] md:text-8xl">
          WHAT
          <br />
          BROKE PROD?
        </h1>

        <form
          onSubmit={submit}
          className="mt-12 space-y-5"
        >
          <Field
            label="AFFECTED COMPONENT"
            value={component}
            onChange={setComponent}
            options={scenario.services.map(
              (service) => service.id,
            )}
          />

          <Field
            label="ROOT CAUSE"
            value={cause}
            onChange={setCause}
            options={causes}
          />

          <Field
            label="TRIGGER"
            value={trigger}
            onChange={setTrigger}
            options={triggers}
          />

          <label className="block">
            <span className="font-mono text-[9px] tracking-wider text-zinc-600">
              OPTIONAL INCIDENT SUMMARY
            </span>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value,
                )
              }
              className="mt-2 h-28 w-full resize-none border border-zinc-800 bg-[#0a0c0e] p-3 text-sm outline-none"
              placeholder="What did you observe?"
            />
          </label>

          <div className="border border-zinc-800 p-4">
            <p className="font-mono text-[9px] tracking-wider text-zinc-600">
              SUPPORTING EVIDENCE
            </p>

            <p className="mt-2 font-mono text-sm">
              {run.evidence.length} SELECTED
            </p>
          </div>

          <Button type="submit">
            SUBMIT INCIDENT
            <ArrowRight size={13} />
          </Button>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[9px] tracking-wider text-zinc-600">
        {label}
      </span>

      <select
        required
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-12 w-full border border-zinc-800 bg-[#0a0c0e] px-3 font-mono text-xs outline-none"
      >
        <option value="">
          Select…
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
