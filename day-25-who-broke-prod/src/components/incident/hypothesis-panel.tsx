import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { Target } from "lucide-react";
import { getScenario } from "@/data/incidents";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { useGameStore } from "@/store/use-game-store";

const causes = [
  "deployment regression",
  "connection lifecycle regression",
  "cache stampede",
  "poison message retry loop",
  "third-party provider degradation",
  "memory leak",
  "database overload",
  "network degradation",
  "capacity exhaustion",
  "feature flag misconfiguration",
];

export function HypothesisPanel() {
  const run = useGameStore(
    (state) => state.run,
  );

  const saveHypothesis = useGameStore(
    (state) => state.saveHypothesis,
  );

  const [component, setComponent] =
    useState("");

  const [cause, setCause] =
    useState("");

  const [confidence, setConfidence] =
    useState<
      "LOW" | "MEDIUM" | "HIGH"
    >("MEDIUM");

  const [selectedEvidence, setSelectedEvidence] =
    useState<string[]>([]);

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  const latest =
    run.hypotheses.at(-1);

  const serviceOptions = useMemo(
    () =>
      scenario.services.map(
        (service) => service.id,
      ),
    [scenario],
  );

  function submit(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!component || !cause) {
      return;
    }

    saveHypothesis({
      componentId: component,
      cause,
      confidence,
      evidenceIds: selectedEvidence,
    });

    setComponent("");
    setCause("");
    setSelectedEvidence([]);
  }

  return (
    <div>
      <SectionHeader
        eyebrow={
          latest
            ? `CURRENT · ${latest.confidence} CONFIDENCE`
            : "STRUCTURED REASONING"
        }
        title="FORM A HYPOTHESIS."
        description="State what you think is broken and connect it to evidence."
      />

      <form
        onSubmit={submit}
        className="grid gap-5 xl:grid-cols-[1fr_360px]"
      >
        <div className="space-y-5">
          <label className="block">
            <span className="font-mono text-[9px] tracking-wider text-zinc-600">
              SUSPECTED COMPONENT
            </span>

            <select
              value={component}
              onChange={(event) =>
                setComponent(
                  event.target.value,
                )
              }
              className="mt-2 h-12 w-full border border-zinc-800 bg-[#0a0c0e] px-3 font-mono text-xs outline-none"
              required
            >
              <option value="">
                Select component
              </option>

              {serviceOptions.map(
                (id) => (
                  <option
                    key={id}
                    value={id}
                  >
                    {id}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="block">
            <span className="font-mono text-[9px] tracking-wider text-zinc-600">
              SUSPECTED CAUSE
            </span>

            <select
              value={cause}
              onChange={(event) =>
                setCause(
                  event.target.value,
                )
              }
              className="mt-2 h-12 w-full border border-zinc-800 bg-[#0a0c0e] px-3 font-mono text-xs outline-none"
              required
            >
              <option value="">
                Select cause
              </option>

              {causes.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="font-mono text-[9px] tracking-wider text-zinc-600">
              CONFIDENCE
            </span>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  "LOW",
                  "MEDIUM",
                  "HIGH",
                ] as const
              ).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setConfidence(value)
                  }
                  className={
                    confidence === value
                      ? "border border-blue-500 bg-blue-950/30 px-4 py-3 font-mono text-[10px] text-blue-200"
                      : "border border-zinc-800 px-4 py-3 font-mono text-[10px] text-zinc-600"
                  }
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit">
            <Target size={13} />
            SAVE HYPOTHESIS
          </Button>
        </div>

        <div>
          <p className="font-mono text-[9px] tracking-wider text-zinc-600">
            SUPPORTING EVIDENCE
          </p>

          <div className="mt-2 border border-zinc-800">
            {run.evidence.length ===
            0 ? (
              <p className="p-4 text-xs text-zinc-600">
                Pin evidence first.
              </p>
            ) : (
              run.evidence.map(
                (item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer gap-3 border-b border-zinc-800 p-3 last:border-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvidence.includes(
                        item.id,
                      )}
                      onChange={() =>
                        setSelectedEvidence(
                          (current) =>
                            current.includes(
                              item.id,
                            )
                              ? current.filter(
                                  (id) =>
                                    id !==
                                    item.id,
                                )
                              : [
                                  ...current,
                                  item.id,
                                ],
                        )
                      }
                    />

                    <span className="text-xs leading-5 text-zinc-400">
                      {item.label}
                    </span>
                  </label>
                ),
              )
            )}
          </div>
        </div>
      </form>

      {run.hypotheses.length > 0 && (
        <div className="mt-10">
          <p className="mb-3 font-mono text-[9px] tracking-wider text-zinc-600">
            HYPOTHESIS HISTORY
          </p>

          <div className="border border-zinc-800">
            {run.hypotheses.map(
              (item, index) => (
                <div
                  key={item.id}
                  className="grid gap-3 border-b border-zinc-800 p-4 last:border-0 md:grid-cols-[50px_180px_1fr_100px]"
                >
                  <span className="font-mono text-xs text-zinc-600">
                    H{index + 1}
                  </span>

                  <span className="font-mono text-xs text-zinc-300">
                    {item.componentId}
                  </span>

                  <span className="text-xs text-zinc-500">
                    {item.cause}
                  </span>

                  <span className="font-mono text-[9px] text-blue-300">
                    {item.confidence}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
