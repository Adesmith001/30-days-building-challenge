import { AnimatePresence, motion } from "motion/react";

type Props = {
  value: string;
};

export function Countdown({
  value,
}: Props) {
  return (
    <div className="grid min-h-[520px] place-items-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={value}
          initial={{
            opacity: 0,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.08,
          }}
          className="font-mono text-7xl font-semibold tracking-tight md:text-9xl"
        >
          {value}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}