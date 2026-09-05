import { motion } from "motion/react";
import { Header } from "./Header";

interface Props {
  onStart: () => void;
}

export function IntroScreen({ onStart }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f3] text-[#171717]">
      <Header layout="intro" />

      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute top-[18%] h-[1px] w-[44%] bg-[#d6d9e4] opacity-40" />

        <div className="relative z-10 max-w-[980px] text-center">
          <h1 className="font-serif text-[clamp(4rem,10vw,9rem)] font-bold leading-[0.78] tracking-[-0.055em]">
            TOUCH THE
            <br />
            BUTTON.
          </h1>

          <p className="mt-5 font-serif text-[17px] text-[#555a69]">
            It would rather you didn't.
          </p>
        </div>

        <div className="mt-24">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStart}
            className="min-h-14 w-[210px] bg-[#1248ff] px-8 font-mono text-[18px] font-bold text-white"
          >
            TOUCH ME
          </motion.button>
        </div>

        <div className="absolute bottom-10 font-mono text-[11px] tracking-[0.08em] text-[#777d90]">
          10 LEVELS · ONE VERY ANNOYING BUTTON
        </div>
      </main>
    </div>
  );
}