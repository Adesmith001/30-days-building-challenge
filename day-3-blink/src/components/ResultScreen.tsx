import {
  ArrowRight,
  Bolt,
  Brain,
  Gauge,
  RotateCcw,
  Share2,
} from "lucide-react";
import { forwardRef } from "react";
import type {
  QuestionCategory,
  RoundResult,
} from "../types/game";
import {
  calculateCategoryScore,
} from "../lib/game";
import { formatScore } from "../lib/utils";

type Props = {
  score: number;
  correct: number;
  bestStreak: number;
  threshold: number;
  personalBest: number;
  isPersonalBest: boolean;
  results: RoundResult[];
  onReplay: () => void;
  onFaster: () => void;
  onShare: () => void;
  onMenu: () => void;
};

const categories: {
  key: QuestionCategory;
  label: string;
}[] = [
  { key: "colour", label: "Colour" },
  { key: "text", label: "Text" },
  { key: "position", label: "Position" },
  { key: "number", label: "Numbers" },
];

export const ResultsScreen = forwardRef<HTMLDivElement, Props>(
  function ResultsScreen(
    {
      score,
      correct,
      bestStreak,
      threshold,
      personalBest,
      isPersonalBest,
      results,
      onReplay,
      onFaster,
      onShare,
      onMenu,
    },
    ref,
  ) {
    const accuracy = Math.round((correct / 10) * 100);

    return (
      <main className="min-h-screen bg-white px-5 py-16 text-neutral-900">
        <div
          ref={ref}
          className="mx-auto max-w-6xl"
        >
          <div className="text-center">
            <span className="rounded-full bg-blue-100 px-5 py-2 font-mono text-xs text-blue-900">
              ★{" "}
              {isPersonalBest
                ? "NEW PERSONAL BEST"
                : `BEST ${formatScore(personalBest)}`}
            </span>

            <h1 className="mt-7 text-7xl font-black tracking-tight text-blue-600">
              {formatScore(score)}
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-slate-400">
              Your Blink session is complete.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            <MetricCard
              icon={<Brain className="size-4" />}
              label="ACCURACY"
              value={`${accuracy}%`}
              detail={`${correct} / 10 correct`}
            />

            <MetricCard
              icon={<Bolt className="size-4" />}
              label="BEST STREAK"
              value={`×${bestStreak}`}
              detail="Consecutive hits"
            />

            <MetricCard
              icon={<Gauge className="size-4" />}
              label="VISUAL THRESHOLD"
              value={`${threshold}MS`}
              detail="Shortest successful exposure"
            />
          </div>

          <section className="mx-auto mt-16 max-w-4xl bg-white p-7 text-neutral-900 md:p-10">
            <div className="flex items-center gap-3">
              <Brain className="size-6" />

              <h2 className="text-2xl font-semibold">
                Attention Profile
              </h2>
            </div>

            <div className="mt-8 space-y-6">
              {categories.map((category) => {
                const value = calculateCategoryScore(
                  results,
                  category.key,
                );

                return (
                  <div key={category.key}>
                    <div className="mb-2 flex justify-between font-mono text-sm">
                      <span>{category.label}</span>
                      <span>{value}%</span>
                    </div>

                    <div className="h-1 bg-slate-200">
                      <div
                        className="h-full bg-blue-700"
                        style={{
                          width: `${value}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mx-auto mt-16 flex max-w-4xl flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onFaster}
            className="flex items-center gap-4 bg-white px-7 py-4 font-mono text-xs text-black"
          >
            GO FASTER
            <ArrowRight className="size-4" />
          </button>

          <button
            type="button"
            onClick={onReplay}
            className="flex items-center gap-4 border border-white/40 px-7 py-4 font-mono text-xs"
          >
            PLAY AGAIN
            <RotateCcw className="size-4" />
          </button>

          <button
            type="button"
            onClick={onShare}
            className="flex items-center gap-4 px-7 py-4 font-mono text-xs text-slate-300"
          >
            SHARE RESULT
            <Share2 className="size-4" />
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="flex items-center gap-4 border border-slate-300 px-7 py-4 font-mono text-xs text-neutral-900"
          >
            GO TO MENU
          </button>
        </div>
      </main>
    );
  },
);

type MetricProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
};

function MetricCard({
  icon,
  label,
  value,
  detail,
}: MetricProps) {
  return (
    <div className="bg-white p-7 text-neutral-900">
      <div className="flex items-center gap-3 font-mono text-xs text-slate-500">
        {icon}
        {label}
      </div>

      <p className="mt-6 text-3xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-slate-500">
        {detail}
      </p>
    </div>
  );
}