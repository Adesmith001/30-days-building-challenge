import { Activity } from "lucide-react";
import type { Stimulus } from "../../types/game";
import { cn } from "../../lib/utils";

type Props = {
  stimulus: Stimulus;
  reveal?: boolean;
};

export function AnalyticsStimulus({
  stimulus,
  reveal = false,
}: Props) {
  const { data, question } = stimulus;
  const highlight = reveal && question.focusKey === "revenue";

  return (
    <div className="w-full max-w-4xl border border-slate-300 bg-white">
      <div className="h-1 bg-violet-600" />

      <div className="p-6 md:p-10">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">
              Financial Dashboard
            </h2>

            <p className="mt-2 text-slate-500">
              Total Revenue Overview
            </p>
          </div>

          <div className="flex items-center gap-2 border border-slate-300 px-3 py-2 font-mono text-xs">
            <span className="size-2 rounded-full bg-emerald-500" />
            LIVE
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
          <div
            className={cn(
              "border border-slate-300 p-7",
              highlight && "ring-4 ring-blue-500",
            )}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-slate-500">
              GROSS REVENUE
            </p>

            <p className="mt-5 text-5xl font-semibold tracking-tight md:text-6xl">
              {data.revenue}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="border border-emerald-300 bg-emerald-50 px-3 py-1 font-mono text-sm text-emerald-700">
                ↑ {data.growth}
              </span>

              <span className="font-mono text-xs text-slate-500">
                vs last month
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between border border-slate-300 p-7">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-slate-500">
                ACTIVE USERS
              </p>

              <p className="mt-4 font-mono text-4xl">
                {Number(data.activeUsers).toLocaleString()}
              </p>
            </div>

            <button
              type="button"
              className="mt-8 bg-neutral-900 px-4 py-4 text-sm font-semibold text-white"
            >
              Generate Report
            </button>
          </div>
        </div>

        <div className="mt-5 border border-slate-300 p-7">
          <div className="mb-8 flex items-center justify-between">
            <p className="font-mono text-xs tracking-[0.18em] text-slate-500">
              REVENUE TREND
            </p>

            <Activity className="size-4 text-blue-700" />
          </div>

          <svg
            viewBox="0 0 700 130"
            className="h-36 w-full"
            aria-hidden="true"
          >
            <path
              d="M0 100 C90 70 130 120 210 88 C300 30 330 62 390 105 C470 160 500 35 570 45 C630 50 655 3 700 54"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-700"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}