import {
  RotateCcw,
  Share2,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  getResultLabel,
} from "../lib/score";

import type {
  GameMode,
  GameStatus,
  SabiWord,
} from "../types/game";

type Props = {
  entry: SabiWord;
  mode: GameMode;
  status: GameStatus;
  attempts: number;
  score: number;
  shareState: string;
  onShare: () => void;
  onNext: () => void;
  onHome: () => void;
};

export function ResultPanel({
  entry,
  mode,
  status,
  attempts,
  score,
  shareState,
  onShare,
  onNext,
  onHome,
}: Props) {
  if (
    status === "playing"
  ) {
    return null;
  }

  const won =
    status === "won";

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        mt-8
        border
        border-[#cfc8be]
        bg-[#f6f0e9]
        p-5
        sm:p-7
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-6
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
            ROUND COMPLETE
          </p>

          <h2
            className="
              mt-2
              font-serif
              text-3xl
              text-[#171513]
            "
          >
            {getResultLabel(
              won,
              attempts,
            )}
          </h2>
        </div>

        <div
          className="
            text-right
          "
        >
          <div
            className="
              font-serif
              text-3xl
              text-[#174c3b]
            "
          >
            {score}
          </div>

          <div
            className="
              font-mono
              text-[9px]
              tracking-[0.14em]
              text-[#6d6963]
            "
          >
            SABI POINTS
          </div>
        </div>
      </div>

      <div
        className="
          grid gap-5
          py-5
          sm:grid-cols-[160px_1fr]
        "
      >
        <div>
          <p
            className="
              font-mono
              text-[10px]
              tracking-[0.14em]
              text-[#77716a]
            "
          >
            THE WORD
          </p>

          <p
            className="
              mt-1
              font-serif
              text-3xl
            "
          >
            {entry.answer}
          </p>
        </div>

        <div
          className="
            space-y-3
            text-sm
            leading-6
            text-[#514d48]
          "
        >
          <p>
            {entry.reveal}
          </p>

          <p
            className="
              font-serif
              text-lg
              italic
              text-[#24211e]
            "
          >
            “{entry.example}”
          </p>
        </div>
      </div>

      <div
        className="
          flex flex-col
          gap-2
          border-t
          border-[#d9d2c8]
          pt-5
          sm:flex-row
        "
      >
        <button
          onClick={onShare}
          className="
            inline-flex
            flex-1
            items-center
            justify-center
            gap-2
            bg-[#174c3b]
            px-4 py-3
            font-mono
            text-[10px]
            tracking-[0.13em]
            text-white
          "
        >
          <Share2
            size={15}
          />

          {shareState ||
            "SHARE RESULT"}
        </button>

        {mode === "run" ? (
          <button
            onClick={onNext}
            className="
              inline-flex
              flex-1
              items-center
              justify-center
              gap-2
              border
              border-[#1b1917]
              px-4 py-3
              font-mono
              text-[10px]
              tracking-[0.13em]
            "
          >
            <RotateCcw
              size={15}
            />

            ANOTHER WORD
          </button>
        ) : (
          <button
            onClick={onHome}
            className="
              flex-1
              border
              border-[#1b1917]
              px-4 py-3
              font-mono
              text-[10px]
              tracking-[0.13em]
            "
          >
            BACK HOME
          </button>
        )}
      </div>
    </motion.section>
  );
}