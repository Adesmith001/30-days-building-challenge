import {
  ArrowRight,
  Eye,
} from "lucide-react";
import { motion } from "motion/react";

type Props = {
  onStart: () => void;
};

export function IntroScreen({
  onStart,
}: Props) {
  return (
    <main className="mx-auto flex max-w-5xl flex-col items-center px-5 pb-20 pt-28 text-center md:pt-44">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-slate-300 px-4 py-2 font-mono text-xs tracking-[0.3em]"
      >
        VISUAL MEMORY TEST
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mt-12 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl"
      >
        HOW MUCH CAN
        <br />
        YOU SEE IN{" "}
        <span className="text-blue-800">
          500MS?
        </span>
      </motion.h1>

      <p className="mt-9 text-base text-slate-600 md:text-lg">
        You get one glance. Pick what you remember.
      </p>

      <div className="mt-16 w-full max-w-2xl border-y border-slate-300 py-6">
        <div className="grid grid-cols-3 items-center gap-3 font-mono">
          <div className="flex items-center justify-center gap-3 border border-blue-800 px-4 py-4 text-sm text-blue-900">
            <Eye className="size-4" />
            500MS
          </div>

          <div className="border border-slate-200 px-4 py-4 text-sm text-slate-400">
            300MS
          </div>

          <div className="border border-slate-200 px-4 py-4 text-sm text-slate-400">
            200MS
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-16 flex items-center gap-8 bg-neutral-900 px-10 py-6 font-mono text-xs tracking-[0.2em] text-white transition hover:bg-blue-800"
      >
        START TEST
        <ArrowRight className="size-5" />
      </button>

      <p className="mt-12 font-mono text-xs tracking-[0.17em] text-slate-500">
        10 ROUNDS · MULTIPLE CHOICE · ABOUT 2 MIN
      </p>
    </main>
  );
}