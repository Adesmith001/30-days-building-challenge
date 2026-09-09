import {
  motion,
} from "motion/react";

export function LoadingState({
  label =
    "THINKING OF THE NEXT QUESTION…",
}: {
  label?: string;
}) {
  return (
    <div
      className="
        flex
        min-h-[42vh]
        flex-col
        items-center
        justify-center
        gap-5
        text-center
      "
    >
      <div className="flex gap-2">
        {[0, 1, 2].map(
          (item) => (
            <motion.span
              key={item}
              className="
                h-1.5
                w-1.5
                bg-ink
              "
              animate={{
                opacity: [
                  0.2,
                  1,
                  0.2,
                ],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay:
                  item *
                  0.18,
              }}
            />
          ),
        )}
      </div>

      <p
        className="
          font-mono
          text-[10px]
          tracking-[0.18em]
          text-graphite
        "
      >
        {label}
      </p>
    </div>
  );
}