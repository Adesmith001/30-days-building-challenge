import { ArrowRight } from "lucide-react";
import { getScenario } from "@/data/incidents";
import { buildTimeline } from "@/lib/timeline";
import { scenarioTime } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/use-game-store";

export function PostmortemScreen() {
  const run = useGameStore(
    (state) => state.run,
  );

  const showScore = useGameStore(
    (state) => state.showScore,
  );

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  const timeline = buildTimeline(
    scenario,
    run,
  );

  return (
    <main className="min-h-screen bg-[#090b0d] text-zinc-100">
      <header className="border-b border-zinc-800 px-5 py-5 md:px-10">
        <p className="font-mono text-[10px] tracking-[0.18em] text-zinc-500">
          {scenario.severity} ·{" "}
          {scenario.title}
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-10">
        <h1 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
          INCIDENT
          <br />
          POSTMORTEM.
        </h1>

        <div className="mt-12 grid gap-px border border-zinc-800 bg-zinc-800 lg:grid-cols-2">
          <Section
            title="IMPACT"
            text={`${run.impact.toLocaleString()} customer operations were failed or delayed during the incident.`}
          />

          <Section
            title="ROOT CAUSE"
            text={scenario.rootCause.summary}
          />

          <Section
            title="MITIGATION"
            text={
              scenario.postmortem.mitigation
            }
          />

          <Section
            title="CONTRIBUTING FACTORS"
            text={scenario.postmortem.contributingFactors.join(
              " ",
            )}
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-mono text-[10px] tracking-wider text-zinc-500">
              YOUR RESPONSE
            </h2>

            <div className="mt-5 border-l border-zinc-800 pl-5">
              {timeline
                .filter(
                  (item) =>
                    item.at >= 0,
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="pb-5"
                  >
                    <p className="font-mono text-[9px] text-zinc-600">
                      {scenarioTime(
                        scenario,
                        item.at,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-zinc-300">
                      {item.label}
                    </p>

                    {item.detail && (
                      <p className="mt-1 text-[11px] leading-5 text-zinc-600">
                        {item.detail}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h2 className="font-mono text-[10px] tracking-wider text-zinc-500">
              FOLLOW-UPS
            </h2>

            <div className="mt-5 border border-zinc-800">
              {scenario.postmortem.followUps.map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex gap-4 border-b border-zinc-800 p-4 last:border-0"
                  >
                    <span className="font-mono text-[10px] text-zinc-700">
                      {String(
                        index + 1,
                      ).padStart(2, "0")}
                    </span>

                    <p className="text-xs text-zinc-400">
                      {item}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <Button
          className="mt-10"
          onClick={showScore}
        >
          INCIDENT SCORE
          <ArrowRight size={13} />
        </Button>
      </section>
    </main>
  );
}

function Section({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="bg-[#090b0d] p-6">
      <h2 className="font-mono text-[9px] tracking-wider text-zinc-600">
        {title}
      </h2>

      <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300">
        {text}
      </p>
    </div>
  );
}

