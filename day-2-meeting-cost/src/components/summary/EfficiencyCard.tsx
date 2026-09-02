import {
  efficiencyScore,
  efficiencyVerdict,
} from "../../lib/calculations";

import type { EfficiencyAnswers } from "../../types/meeting";
import { SectionLabel } from "../ui/SectionLabel";

interface Props {
  answers?: EfficiencyAnswers;
  onChange: (answers: EfficiencyAnswers) => void;
}

export function EfficiencyCard({
  answers = {
    decisionMade: false,
    clearAgenda: false,
    everyoneNeeded: false,
  },
  onChange,
}: Props) {
  const score = efficiencyScore(answers);

  return (
    <section className="border border-black/20 bg-[#f8f8f8]/95 p-6 md:p-9">
      <SectionLabel>POST-MORTEM</SectionLabel>

      <h2 className="mt-6 text-3xl font-bold tracking-[-0.05em]">
        WAS IT WORTH IT?
      </h2>

      <div className="my-6 h-px bg-black/20" />

      <div className="grid gap-5 md:grid-cols-[1fr_220px] md:items-center">
        <div>
          <SectionLabel>EFFICIENCY SCORE</SectionLabel>

          <strong className="mt-2 block text-5xl tracking-[-0.07em]">
            {score}
            <small className="text-xl text-neutral-500">
              /100
            </small>
          </strong>
        </div>

        <div className="flex min-h-24 items-center justify-center bg-black p-5 text-center font-mono text-[10px] leading-5 text-white">
          VERDICT:{" "}
          {efficiencyVerdict(score).toUpperCase()}
        </div>
      </div>

      <div className="mt-6">
        <Question
          value={answers.clearAgenda}
          label="Clear agenda defined beforehand?"
          onClick={() =>
            onChange({
              ...answers,
              clearAgenda: !answers.clearAgenda,
            })
          }
        />

        <Question
          value={answers.decisionMade}
          label="Was a decision made?"
          onClick={() =>
            onChange({
              ...answers,
              decisionMade: !answers.decisionMade,
            })
          }
        />

        <Question
          value={answers.everyoneNeeded}
          label="Did everyone need to attend?"
          onClick={() =>
            onChange({
              ...answers,
              everyoneNeeded: !answers.everyoneNeeded,
            })
          }
        />
      </div>
    </section>
  );
}

function Question({
  value,
  label,
  onClick,
}: {
  value: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 w-full items-center gap-4 border-b border-black/20 text-left"
    >
      <span className="flex size-6 shrink-0 items-center justify-center border border-black font-mono text-xs">
        {value ? "X" : ""}
      </span>

      <span>{label}</span>
    </button>
  );
}