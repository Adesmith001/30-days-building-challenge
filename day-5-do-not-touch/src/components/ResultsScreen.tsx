import { useRef } from "react";
import type {
  PersonalBest,
  RunStats,
} from "../types/game";
import { getInsight } from "../lib/insights";
import { getNextRank, getRank } from "../lib/rank";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ShareActions } from "./ShareAction";

interface Props {
  stats: RunStats;
  best: PersonalBest;
  newBest: boolean;
  onReplay: () => void;
  onReset: () => void;
}

function formatTime(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainder,
  ).padStart(2, "0")}`;
}

export function ResultsScreen({
  stats,
  best,
  newBest,
  onReplay,
  onReset,
}: Props) {
  const resultRef = useRef<HTMLDivElement>(null);

  const rank = getRank(stats.score);
  const nextRank = getNextRank(stats.score);
  const insight = getInsight(stats);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f3]">
      <Header />

      <main className="mx-auto w-full max-w-[980px] flex-1 px-5 py-12 md:px-7 md:py-16">
        <div
          ref={resultRef}
          className="border border-[#cfd3df] bg-[#f8f6f3] px-7 py-10 md:px-12 md:py-14"
        >
          <div className="flex justify-between font-mono text-[9px] tracking-[0.14em] text-[#73798c]">
            <span>FINAL SCORE</span>
            <span>DAY 05 / 30</span>
          </div>

          {newBest && (
            <div className="mt-8 font-mono text-[10px] font-bold tracking-[0.15em] text-[#1248ff]">
              [*] NEW PERSONAL BEST OO
            </div>
          )}

          <div className="mt-8">
            <h1 className="font-mono text-[clamp(4rem,12vw,8.5rem)] font-bold leading-none tracking-[-0.07em]">
              {stats.score.toLocaleString()}
            </h1>

            <h2 className="mt-3 text-[clamp(2rem,5vw,3.8rem)] font-black tracking-[-0.045em] text-[#1248ff]">
              {rank.name}
            </h2>
          </div>

          {nextRank ? (
            <p className="mt-7 max-w-sm font-mono text-[11px] leading-6 tracking-[0.08em] text-[#646a7d]">
              {nextRank.pointsAway.toLocaleString()} POINTS TO REACH
              <br />
              <span className="text-[#171717]">
                {nextRank.name}
              </span>
            </p>
          ) : (
            <p className="mt-7 font-mono text-[11px] tracking-[0.08em] text-[#1248ff]">
              YOU DON REACH THE TOP
            </p>
          )}

          <div className="mt-12 grid gap-px border-y border-[#cfd3df] bg-[#cfd3df] sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["LEVELS WE CLEAR", `${stats.levelsCleared} / 10`],
              ["TOTAL TIME", formatTime(stats.totalTimeMs)],
              ["MISSES", String(stats.misses)],
              ["NO-MISS CATCHES", String(stats.cleanCatches)],
              ["BEST RUN", `×${stats.bestStreak}`],
              [
                "FASTEST CATCH",
                stats.fastestCatchMs
                  ? `${(stats.fastestCatchMs / 1000).toFixed(2)}S`
                  : "--",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-[#f8f6f3] px-5 py-5"
              >
                <div className="font-mono text-[9px] tracking-[0.12em] text-[#777d8e]">
                  {label}
                </div>

                <div className="mt-2 font-mono text-[20px] font-bold">
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="font-mono text-[9px] tracking-[0.14em] text-[#73798c]">
              HOW YOU TAKE AM
            </div>

            <p className="mt-3 max-w-[700px] text-[18px] leading-7 text-[#373c4b]">
              {insight}
            </p>
          </div>

          <div className="mt-8 border-t border-[#d6d8df] pt-5 font-mono text-[9px] tracking-[0.12em] text-[#70768a]">
            PERSONAL BEST: {best.score.toLocaleString()} PTS OO
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr]">
          <button
            onClick={onReplay}
            className="min-h-14 bg-[#1248ff] px-5 font-mono text-[13px] font-bold text-white"
          >
            TRY AM AGAIN →
          </button>

          <ShareActions
            stats={stats}
            targetRef={resultRef}
          />
        </div>
      </main>

      <Footer onReset={onReset} />
    </div>
  );
}