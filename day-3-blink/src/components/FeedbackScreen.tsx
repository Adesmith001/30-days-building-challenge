import {
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import type { Stimulus } from "../types/game";

type Props = {
  correct: boolean;
  points: number;
  streak: number;
  exposure: number;
  stimulus: Stimulus;
  onContinue: () => void;
};

export function FeedbackScreen({
  correct,
  points,
  streak,
  exposure,
  stimulus,
  onContinue,
}: Props) {
  return (
    <div className="mx-auto flex min-h-[550px] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <div
        className={[
          "grid size-14 place-items-center rounded-full",
          correct
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700",
        ].join(" ")}
      >
        {correct ? (
          <Check className="size-6" />
        ) : (
          <X className="size-6" />
        )}
      </div>

      <p className="mt-8 font-mono text-xs tracking-[0.22em] text-slate-500">
        {correct ? "CORRECT" : "INCORRECT"}
      </p>

      <h2 className="mt-4 text-5xl font-black tracking-tight">
        {correct ? "GOOD EYE." : "MISSED IT."}
      </h2>

      <p className="mt-7 font-mono text-3xl text-blue-800">
        +{points}
      </p>

      <p className="mt-3 font-mono text-sm">
        STREAK ×{streak}
      </p>

      {!correct && (
        <p className="mt-8 text-slate-600">
          Correct answer:{" "}
          <strong>
            {stimulus.question.correctAnswer}
          </strong>
        </p>
      )}

      <p className="mt-3 text-sm text-slate-500">
        You saw it for {exposure}ms.
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="mt-10 flex items-center gap-6 bg-neutral-900 px-8 py-5 font-mono text-xs tracking-[0.15em] text-white"
      >
        SEE IT AGAIN
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}