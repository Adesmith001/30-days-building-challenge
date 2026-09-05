import { useEffect } from "react";
import { motion } from "motion/react";
import { Header } from "./Header";

interface Props {
  onDone: () => void;
}

export function BossEnding({ onDone }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1700);

    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f3]">
      <Header layout="intro" />

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.94,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <div className="mb-9 inline-flex h-14 min-w-[170px] items-center justify-center bg-[#1248ff] px-8 font-mono text-[15px] font-bold text-white">
            E DON DO.
          </div>

          <h1 className="text-[clamp(4rem,10vw,8rem)] font-black tracking-[-0.07em]">
            E DON DO NAU.
          </h1>

          <p className="mt-3 text-[18px] text-[#4b5060]">
            You don touch am. You happy now, abi?
          </p>

          <p className="mt-10 font-mono text-[9px] tracking-[0.14em] text-[#777d90]">
            PALAVA DON FINISH.
          </p>
        </motion.div>
      </main>
    </div>
  );
}