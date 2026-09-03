import type {
  AnswerOption,
  Stimulus,
} from "../types/game";
import { AnswerGrid } from "./AnswerGrid";

type Props = {
  stimulus: Stimulus;
  round: number;
  exposure: number;
  score: number;
  streak: number;
  selected: string | null;
  locked: boolean;
  onAnswer: (option: AnswerOption) => void;
};

export function QuestionScreen({
  stimulus,
  round,
  exposure,
  score,
  streak,
  selected,
  locked,
  onAnswer,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 md:px-8">
      <div className="flex items-center justify-between border-b border-slate-300 pb-5 font-mono text-xs">
        <span className="border border-slate-300 px-3 py-2">
          ROUND {String(round).padStart(2, "0")}/10
        </span>

        <span className="text-slate-600">
          SHOWN FOR {exposure}MS
        </span>
      </div>

      <h1 className="mx-auto my-16 max-w-3xl text-center text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-6xl">
        {stimulus.question.prompt}
      </h1>

      <AnswerGrid
        options={stimulus.question.options}
        selected={selected}
        disabled={locked}
        onSelect={onAnswer}
      />

      <div className="mt-16 flex justify-center gap-10 font-mono text-xs">
        <div className="text-center">
          <p className="text-slate-500">
            SCORE
          </p>

          <p className="mt-2 text-lg">
            {score.toLocaleString()}
          </p>
        </div>

        <div className="h-12 w-px bg-slate-300" />

        <div className="text-center">
          <p className="text-slate-500">
            STREAK
          </p>

          <p className="mt-2 text-lg">
            ×{streak}
          </p>
        </div>
      </div>
    </div>
  );
}