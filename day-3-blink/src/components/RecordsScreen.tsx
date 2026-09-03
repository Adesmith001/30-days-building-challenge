import {
  ArrowLeft,
  Bolt,
  Gauge,
  History,
  Trophy,
} from "lucide-react";
import type {
  QuestionCategory,
  SessionRecord,
  StoredStats,
} from "../types/game";
import { calculateCategoryScore } from "../lib/game";
import { formatScore } from "../lib/utils";

type Props = {
  records: SessionRecord[];
  stats: StoredStats;
  onBack: () => void;
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

export function RecordsScreen({ records, stats, onBack }: Props) {
  const fastest = records.reduce(
    (minimum, record) => Math.min(minimum, record.threshold),
    records.length ? 500 : 0,
  );

  const averageAccuracy = records.length
    ? Math.round(
        records.reduce(
          (total, record) => total + (record.correct / 10) * 100,
          0,
        ) / records.length,
      )
    : 0;

  return (
    <main className="min-h-screen bg-[#f8f7f5] px-5 py-10 text-neutral-900 md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-slate-300 pb-6">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-slate-500">
              BLINK / RECORDS
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Your records
            </h1>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 border border-slate-300 px-4 py-3 font-mono text-xs"
          >
            <ArrowLeft className="size-4" />
            MENU
          </button>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={<Trophy />} label="PERSONAL BEST" value={formatScore(stats.personalBest)} />
          <Metric icon={<Gauge />} label="FASTEST LATENCY" value={`${fastest}MS`} />
          <Metric icon={<Bolt />} label="BEST STREAK" value={`×${stats.highestStreak}`} />
          <Metric icon={<History />} label="AVG ACCURACY" value={`${averageAccuracy}%`} />
        </div>

        <section className="mt-10 border border-slate-300 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-slate-500">
                PERFORMANCE PROFILE
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Where you focus best</h2>
            </div>
            <span className="font-mono text-xs text-slate-500">
              {stats.sessionsPlayed} SESSIONS
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {categories.map((category) => {
              const value = calculateCategoryScore(
                records.flatMap((record) => record.results),
                category.key,
              );

              return (
                <div key={category.key}>
                  <div className="mb-2 flex justify-between font-mono text-xs">
                    <span>{category.label}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-1 bg-slate-200">
                    <div className="h-full bg-blue-700" style={{ width: `${value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-slate-500">SESSION LOG</p>
              <h2 className="mt-2 text-2xl font-semibold">Recent runs</h2>
            </div>
            <span className="font-mono text-xs text-slate-500">LAST 20</span>
          </div>

          {records.length ? (
            <div className="space-y-3">
              {records.map((record) => (
                <details key={record.id} className="border border-slate-300 bg-white">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 p-5">
                    <span className="font-mono text-xs text-slate-500">
                      {new Date(record.playedAt).toLocaleString()}
                    </span>
                    <span className="font-semibold">{formatScore(record.score)} PTS</span>
                    <span className="font-mono text-xs">{record.correct}/10 · {record.threshold}MS</span>
                  </summary>
                  <div className="border-t border-slate-200 px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {record.results.map((result) => (
                        <span
                          key={result.round}
                          className={`border px-3 py-2 font-mono text-xs ${result.correct ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}
                        >
                          R{result.round} · {result.exposure}MS · {result.correct ? "HIT" : "MISS"}
                        </span>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Complete a session to start building your records.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-slate-300 bg-white p-5">
      <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-5 text-3xl font-semibold">{value}</p>
    </div>
  );
}