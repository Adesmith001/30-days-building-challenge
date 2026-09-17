import {
  Lightbulb,
} from "lucide-react";

import type {
  SabiWord,
} from "../types/game";

type Props = {
  entry: SabiWord;
  hintUsed: boolean;
  onHint: () => void;
  disabled?: boolean;
};

export function ClueCard({
  entry,
  hintUsed,
  onHint,
  disabled,
}: Props) {
  return (
    <section
      className="
        border-y
        border-[#d9d2c8]
        py-5 sm:py-6
      "
    >
      <div
        className="
          mb-3 flex
          items-center
          justify-between
          gap-4
          font-mono
          text-[10px]
          tracking-[0.16em]
          text-[#6d6963]
        "
      >
        <span>
          {entry.category}
          {" · "}
          FIND THE WORD
        </span>

        <span>
          {entry.answer.length}
          {" LETTERS"}
        </span>
      </div>

      <p
        className="
          max-w-2xl
          font-serif
          text-2xl
          leading-tight
          text-[#171513]
          sm:text-3xl
        "
      >
        {entry.clue}
      </p>

      <div
        className="
          mt-5 flex
          flex-wrap
          items-start
          justify-between
          gap-4
        "
      >
        <div
          className="
            min-h-6
            text-sm
            text-[#5f5b55]
          "
        >
          {hintUsed ? (
            <span>
              <b>HINT:</b>{" "}
              {entry.hint}
            </span>
          ) : (
            <>
              One hint available ·
              costs 100 points
            </>
          )}
        </div>

        <button
          onClick={onHint}
          disabled={
            hintUsed ||
            disabled
          }
          className="
            inline-flex
            items-center
            gap-2
            border-b
            border-dotted
            border-[#6d6963]
            pb-0.5
            font-mono
            text-[10px]
            tracking-[0.14em]
            text-[#3e3a35]
            disabled:cursor-default
            disabled:opacity-40
          "
        >
          <Lightbulb
            size={14}
            strokeWidth={1.6}
          />

          {hintUsed
            ? "HINT USED"
            : "GIVE ME A HINT"}
        </button>
      </div>
    </section>
  );
}