import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import { ArrowRight } from "lucide-react";
import type { LevelConfig } from "../types/game";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface Props {
  level: LevelConfig;
  onStart: () => void;
  onReset: () => void;
}

export function LevelIntro({
  level,
  onStart,
  onReset,
}: Props) {
  const fired = useRef(false);

  const begin = useCallback(() => {
    if (fired.current) return;

    fired.current = true;
    onStart();
  }, [onStart]);

  useEffect(() => {
    const timer = window.setTimeout(begin, 1250);

    return () => window.clearTimeout(timer);
  }, [begin]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f3]">
      <Header layout="intro" />

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <section className="relative w-full max-w-[610px] border border-[#d2d5df] px-8 py-14 md:px-12 md:py-16">
          <div className="absolute -left-[1px] -top-[1px] h-3 w-3 border-l-2 border-t-2 border-[#171717]" />
          <div className="absolute -right-[1px] -top-[1px] h-3 w-3 border-r-2 border-t-2 border-[#171717]" />
          <div className="absolute -bottom-[1px] -left-[1px] h-3 w-3 border-b-2 border-l-2 border-[#171717]" />
          <div className="absolute -bottom-[1px] -right-[1px] h-3 w-3 border-b-2 border-r-2 border-[#171717]" />

          <div className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.12em]">
            <span className="border border-[#aebeff] px-2 py-1 text-[#1248ff]">
              LEVEL {String(level.id).padStart(2, "0")}
            </span>

            <span className="text-[#6d7387]">
              SPECIMEN DEY CHANGE
            </span>
          </div>

          <h1 className="max-w-[520px] font-sans text-[clamp(3rem,7vw,5.5rem)] font-black leading-[0.88] tracking-[-0.05em]">
            {level.title}
          </h1>

          <p className="mt-6 text-[18px] text-[#3d4252]">
            {level.subtitle}
          </p>

          <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-[#777d91]">
            {level.protocol}
          </p>

          <div className="mt-16 border-t border-[#d6d8df] pt-8">
            <button
              onClick={begin}
              className="flex min-h-14 w-full items-center justify-between bg-[#1248ff] px-7 font-mono text-[15px] font-bold text-white"
            >
              ENTER LEVEL{" "}
              {String(level.id).padStart(2, "0")}
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="mt-5 flex justify-between font-mono text-[9px] tracking-[0.12em] text-[#747b8e]">
            <span>INPUT: POINTER MOVE</span>

            <span className="text-[#b92a13]">
              NO ACCIDENTAL TOUCH
            </span>
          </div>
        </section>
      </main>

      <Footer onReset={onReset} />
    </div>
  );
}