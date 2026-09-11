import { useEffect, useState } from "react";
import { motion } from "motion/react";

const messages = [
  "Reading everything...",
  "Finding what actually matters...",
  "Separating tasks from thoughts...",
  "Almost clear.",
];

interface ProcessingStateProps {
  text: string;
}

export function ProcessingState({
  text,
}: ProcessingStateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) =>
        Math.min(current + 1, messages.length - 1),
      );
    }, 800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="flex flex-1 items-center px-4 py-12">
      <div className="mx-auto w-full max-w-[760px]">
        <div className="rounded-xl border border-line bg-panel/60 p-6 opacity-45">
          <p className="line-clamp-5 text-[17px] leading-8 text-muted">
            {text}
          </p>
        </div>

        <motion.div
          key={messages[index]}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-14 text-center"
        >
          <div className="mx-auto mb-5 flex h-7 w-7 items-center justify-center">
            <motion.span
              className="h-2 w-2 rounded-full bg-accent"
              animate={{
                scale: [1, 1.7, 1],
                opacity: [0.45, 1, 0.45],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
              }}
            />
          </div>

          <h1 className="text-2xl font-medium tracking-[-0.02em] text-ink">
            {messages[index]}
          </h1>

          <p className="mt-2 text-sm text-muted">
            Don&apos;t worry. Your original dump stays intact.
          </p>
        </motion.div>
      </div>
    </main>
  );
}