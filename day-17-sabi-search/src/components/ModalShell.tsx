import {
  X,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import type {
  ReactNode,
} from "react";

type Props = {
  title: string;
  eyebrow: string;
  children: ReactNode;
  onClose: () => void;
};

export function ModalShell({
  title,
  eyebrow,
  children,
  onClose,
}: Props) {
  return (
    <div
      className="
        fixed inset-0 z-50
        grid place-items-center
        bg-[#171513]/35
        p-4
      "
      onMouseDown={
        onClose
      }
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        onMouseDown={(
          event,
        ) =>
          event.stopPropagation()
        }
        className="
          max-h-[88vh]
          w-full
          max-w-xl
          overflow-y-auto
          border
          border-[#bdb5aa]
          bg-[#fbf7f2]
          p-5
          sm:p-7
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-5
            border-b
            border-[#d9d2c8]
            pb-5
          "
        >
          <div>
            <p
              className="
                font-mono
                text-[10px]
                tracking-[0.16em]
                text-[#6d6963]
              "
            >
              {eyebrow}
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-3xl
                text-[#171513]
              "
            >
              {title}
            </h2>
          </div>

          <button
            onClick={
              onClose
            }
            aria-label="Close"
            className="
              p-1
              text-[#625f5a]
              hover:text-[#111]
            "
          >
            <X
              size={20}
              strokeWidth={
                1.5
              }
            />
          </button>
        </div>

        {children}
      </motion.div>
    </div>
  );
}