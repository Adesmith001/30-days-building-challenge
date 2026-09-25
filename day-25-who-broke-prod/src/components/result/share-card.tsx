import {
  forwardRef,
} from "react";
import type {
  IncidentRunState,
  IncidentScenario,
  ScoreBreakdown,
} from "@/types";
import { duration } from "@/lib/time";

interface Props {
  scenario: IncidentScenario;
  run: IncidentRunState;
  score: ScoreBreakdown;
}

export const ShareCard = forwardRef<
  HTMLDivElement,
  Props
>(function ShareCard(
  { scenario, run, score },
  ref,
) {
  return (
    <div
      ref={ref}
      className="aspect-square w-full max-w-[560px] border border-zinc-700 bg-[#090b0d] p-8 text-zinc-100"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em]">
            WHO BROKE PROD?
          </p>

          <p className="mt-1 font-mono text-[9px] text-zinc-600">
            DAY 25 / 30
          </p>
        </div>

        <p className="font-mono text-xs text-red-300">
          {scenario.severity}
        </p>
      </div>

      <div className="mt-16">
        <p className="font-mono text-[10px] text-zinc-600">
          INCIDENT
        </p>

        <h3 className="mt-2 text-3xl font-black tracking-tight">
          {scenario.alert.title}
        </h3>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-px bg-zinc-800">
        <Block
          label="RECOVERED"
          value={duration(
            run.recoveryAt ??
              run.simulatedTime,
          )}
        />

        <Block
          label="IMPACT"
          value={run.impact.toLocaleString()}
        />

        <Block
          label="SCORE"
          value={score.total.toLocaleString()}
        />

        <Block
          label="RANK"
          value={score.rank}
        />
      </div>

      <div className="mt-12 border-l border-zinc-700 pl-4">
        <p className="text-sm font-semibold">
          THE ALERT FIRED.
          <br />
          I FOUND WHY.
        </p>
      </div>
    </div>
  );
});

function Block({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#090b0d] p-4">
      <p className="font-mono text-[8px] tracking-wider text-zinc-600">
        {label}
      </p>

      <p className="mt-2 font-mono text-base">
        {value}
      </p>
    </div>
  );
}

