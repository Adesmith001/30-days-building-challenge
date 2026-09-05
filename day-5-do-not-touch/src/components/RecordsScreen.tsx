import { ArrowLeft } from "lucide-react";
import type { PersonalBest } from "../types/game";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface Props {
  best: PersonalBest;
  onBack: () => void;
  onReplay: () => void;
  onReset: () => void;
}

function formatTime(milliseconds: number | null) {
  if (milliseconds === null) return "--";

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainder,
  ).padStart(2, "0")}`;
}

export function RecordsScreen({
  best,
  onBack,
  onReplay,
  onReset,
}: Props) {
  const records = [
    ["HIGHEST SCORE", best.score ? best.score.toLocaleString() : "--"],
    ["FASTEST RUN", formatTime(best.fastestRunMs)],
    [
      "FEWEST MISS",
      best.fewestMisses === null
        ? "--"
        : String(best.fewestMisses),
    ],
    [
      "FASTEST CATCH",
      best.fastestCatchMs === null
        ? "--"
        : `${(best.fastestCatchMs / 1000).toFixed(2)}S`,
    ],
    ["BEST RUN", best.bestStreak ? `×${best.bestStreak}` : "--"],
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f3]">
      <Header />

      <main className="mx-auto flex w-full max-w-[980px] flex-1 flex-col justify-center px-5 py-10 md:px-7 md:py-14">
        <div className="border border-[#cfd3df] px-7 py-9 md:px-12 md:py-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="font-mono text-[9px] tracking-[0.14em] text-[#73798c]">
                DAY 05 / 30
              </div>

              <h1 className="mt-3 text-[clamp(3rem,8vw,6.5rem)] font-black leading-none tracking-[-0.07em]">
                YOUR RECORDS
              </h1>

              <p className="mt-4 max-w-xl text-[18px] leading-7 text-[#373c4b]">
                See the marks you don set. No need to play again just to check
                how you dey perform.
              </p>
            </div>

            <button
              type="button"
              onClick={onBack}
              aria-label="Back to result"
              title="Back to result"
              className="flex min-h-11 min-w-11 items-center justify-center border border-[#171717] transition-colors hover:bg-[#171717] hover:text-white"
            >
              <ArrowLeft size={17} />
            </button>
          </div>

          <div className="mt-10 grid gap-px border-y border-[#cfd3df] bg-[#cfd3df] sm:grid-cols-2 lg:grid-cols-5">
            {records.map(([label, value]) => (
              <div
                key={label}
                className="bg-[#f8f6f3] px-4 py-5"
              >
                <div className="font-mono text-[8px] tracking-[0.1em] text-[#777d8e]">
                  {label}
                </div>

                <div className="mt-3 font-mono text-[22px] font-bold">
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 font-mono text-[9px] tracking-[0.12em] text-[#70768a]">
            ALL RECORDS SAVE FOR THIS BROWSER ONLY.
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onBack}
              className="min-h-14 border border-[#171717] px-5 font-mono text-[13px] font-bold transition-colors hover:bg-[#171717] hover:text-white"
            >
              BACK TO RESULT
            </button>

            <button
              type="button"
              onClick={onReplay}
              className="min-h-14 bg-[#1248ff] px-5 font-mono text-[13px] font-bold text-white transition-colors hover:bg-[#0d39d4]"
            >
              TRY AM AGAIN →
            </button>
          </div>
        </div>
      </main>

      <Footer onReset={onReset} />
    </div>
  );
}
