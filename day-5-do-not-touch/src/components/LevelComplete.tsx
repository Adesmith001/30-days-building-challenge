import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import type {
  CatchSummary,
  LevelConfig,
} from "../types/game";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface Props {
  level: LevelConfig;
  summary: CatchSummary;
  score: number;
  onNext: () => void;
  onReset: () => void;
}

export function LevelComplete({
  level,
  summary,
  score,
  onNext,
  onReset,
}: Props) {
  const fired = useRef(false);

  const next = useCallback(() => {
    if (fired.current) return;

    fired.current = true;
    onNext();
  }, [onNext]);

  useEffect(() => {
    const timer = window.setTimeout(next, 1200);

    const keydown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        next();
      }
    };

    window.addEventListener("keydown", keydown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", keydown);
    };
  }, [next]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f3]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <section className="relative w-full max-w-[560px] border border-[#cfd3df] px-8 py-12 text-center md:px-12">
          <div className="flex justify-between font-mono text-[9px] tracking-[0.13em] text-[#6d7387]">
            <span>
              EVENT {String(level.id).padStart(2, "0")} //
              HIT DON LAND
            </span>

            <span>
              SCORE {score.toLocaleString()}
            </span>
          </div>

          <h1 className="mt-20 text-[clamp(4rem,10vw,6rem)] font-black leading-none tracking-[-0.06em]">
            YOU CATCH AM.
          </h1>

          <div className="mt-3 font-mono text-[48px] leading-none">
            {(summary.elapsedMs / 1000).toFixed(2)}
            <span className="ml-1 text-[19px] text-[#73798a]">
              S
            </span>
          </div>

          <div className="mx-auto mt-5 inline-flex border border-[#cfd3df] px-4 py-2 font-mono">
            <span className="text-[20px] font-bold text-[#1248ff]">
              +{summary.points}
            </span>

            <span className="ml-3 text-[9px] tracking-[0.14em] text-[#466453]">
              [*] {summary.label}
            </span>
          </div>

          <div className="mt-20 grid grid-cols-3 border-t border-[#cfd3df] pt-5 font-mono text-[9px] tracking-[0.12em]">
            <span className="text-left">
              {summary.misses === 0
                ? "NO MISS"
                : `${summary.misses} MISS`}
            </span>

            <span className="text-[#1248ff]">
              RUN ×{summary.streak}
            </span>

            <span className="text-right">
              LEVEL {String(level.id).padStart(2, "0")} / 10
            </span>
          </div>

          <button
            onClick={next}
            className="mt-8 min-h-14 w-full bg-[#1248ff] font-mono text-[13px] font-bold text-white"
          >
            CONTINUE [SPACEBAR]
          </button>
        </section>
      </main>

      <Footer onReset={onReset} />
    </div>
  );
}