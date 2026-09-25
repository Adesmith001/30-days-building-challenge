import {
  useRef,
  useState,
} from "react";
import {
  Download,
  RefreshCcw,
  Share2,
} from "lucide-react";
import { toPng } from "html-to-image";
import { getScenario } from "@/data/incidents";
import { Button } from "@/components/ui/button";
import { ShareCard } from "./share-card";
import { useGameStore } from "@/store/use-game-store";

export function ScoreScreen() {
  const run = useGameStore(
    (state) => state.run,
  );

  const shift = useGameStore(
    (state) => state.shift,
  );

  const continueAfterScore =
    useGameStore(
      (state) =>
        state.continueAfterScore,
    );

  const restartIncident =
    useGameStore(
      (state) =>
        state.restartIncident,
    );

  const [sharing, setSharing] =
    useState(false);

  const cardRef =
    useRef<HTMLDivElement>(null);

  if (!run?.finalScore) {
    return null;
  }

  const scenario = getScenario(
    run.scenarioId,
  );

  const score = run.finalScore;

  async function share() {
    if (!cardRef.current) return;

    setSharing(true);

    try {
      const dataUrl = await toPng(
        cardRef.current,
        {
          pixelRatio: 2,
        },
      );

      const response = await fetch(
        dataUrl,
      );

      const blob =
        await response.blob();

      const file = new File(
        [blob],
        "who-broke-prod.png",
        {
          type: "image/png",
        },
      );

      if (
        navigator.canShare?.({
          files: [file],
        })
      ) {
        await navigator.share({
          title: "Who Broke Prod?",
          text: `I scored ${score.total.toLocaleString()} on Who Broke Prod?`,
          files: [file],
        });
      } else {
        const link =
          document.createElement("a");

        link.download =
          "who-broke-prod.png";
        link.href = dataUrl;
        link.click();
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090b0d] px-5 py-12 text-zinc-100 md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-12 xl:grid-cols-[1fr_560px]">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-600">
              INCIDENT SCORE
            </p>

            <h1 className="mt-4 font-mono text-7xl tracking-[-0.06em] md:text-9xl">
              {score.total.toLocaleString()}
            </h1>

            <p className="mt-4 text-xl font-semibold tracking-[0.14em] text-blue-300">
              {score.rank}
            </p>

            <div className="mt-10 border border-zinc-800">
              <ScoreRow
                label="MITIGATION"
                value={score.mitigation}
                max={3000}
              />

              <ScoreRow
                label="ROOT CAUSE"
                value={score.rootCause}
                max={2500}
              />

              <ScoreRow
                label="CUSTOMER IMPACT"
                value={
                  score.customerImpact
                }
                max={2000}
              />

              <ScoreRow
                label="INVESTIGATION"
                value={
                  score.investigation
                }
                max={1500}
              />

              <ScoreRow
                label="OPERATIONAL SAFETY"
                value={score.safety}
                max={1000}
              />
            </div>

            <div className="mt-8">
              <p className="font-mono text-[9px] tracking-wider text-zinc-600">
                WHY THIS SCORE?
              </p>

              <div className="mt-3 border border-zinc-800">
                {score.reasons.map(
                  (reason) => (
                    <p
                      key={reason}
                      className="border-b border-zinc-800 p-3 text-xs text-zinc-400 last:border-0"
                    >
                      {reason}
                    </p>
                  ),
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                onClick={share}
                disabled={sharing}
              >
                {sharing ? (
                  "RENDERING…"
                ) : (
                  <>
                    <Share2 size={13} />
                    SHARE RESULT
                  </>
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={
                  restartIncident
                }
              >
                <RefreshCcw size={13} />
                REPLAY
              </Button>

              <Button
                variant="secondary"
                onClick={
                  continueAfterScore
                }
              >
                {shift
                  ? shift.index <
                    shift.ids.length - 1
                    ? "NEXT INCIDENT →"
                    : "FINISH SHIFT →"
                  : "INCIDENT LIBRARY →"}
              </Button>
            </div>
          </div>

          <div>
            <ShareCard
              ref={cardRef}
              scenario={scenario}
              run={run}
              score={score}
            />

            <p className="mt-3 flex items-center gap-2 font-mono text-[9px] text-zinc-700">
              <Download size={11} />
              SHARE FALLBACK EXPORTS PNG
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function ScoreRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_140px] border-b border-zinc-800 p-4 last:border-0">
      <span className="text-xs tracking-wider text-zinc-500">
        {label}
      </span>

      <span className="text-right font-mono text-xs">
        {value.toLocaleString()} /{" "}
        {max.toLocaleString()}
      </span>
    </div>
  );
}
