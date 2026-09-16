import {
  AnimatePresence,
  motion,
} from "motion/react";

export default function GameToast({
  message,
}: {
  message: string | null;
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 8,
          }}
          className="
            fixed
            bottom-5
            right-5
            z-50
            border
            border-ink
            bg-ink
            px-4
            py-3
            font-mono
            text-xs
            text-paper
          "
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}