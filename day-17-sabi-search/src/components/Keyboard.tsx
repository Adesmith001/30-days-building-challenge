import {
  Delete,
} from "lucide-react";

import type {
  LetterStatus,
} from "../types/game";

const ROWS = [
  "QWERTYUIOP",
  "ASDFGHJKL",
  "ZXCVBNM",
];

const statusStyles:
  Record<
    LetterStatus,
    string
  > = {
    correct:
      "bg-[#174c3b] text-white border-[#174c3b]",

    present:
      "bg-[#b56820] text-white border-[#b56820]",

    absent:
      "bg-[#d8d3cc] text-[#817c75] border-[#d8d3cc]",

    empty:
      "bg-[#f1ece6] text-[#1b1917] border-[#d7d0c7]",
  };

type Props = {
  statuses:
    Map<
      string,
      LetterStatus
    >;

  onLetter:
    (letter: string) => void;

  onEnter:
    () => void;

  onDelete:
    () => void;

  disabled?: boolean;
};

export function Keyboard({
  statuses,
  onLetter,
  onEnter,
  onDelete,
  disabled,
}: Props) {
  return (
    <div
      className="
        mx-auto flex
        w-full max-w-[620px]
        flex-col
        gap-1.5
        select-none
        sm:gap-2
      "
    >
      {ROWS.map(
        (
          row,
          rowIndex,
        ) => (
          <div
            key={row}
            className="
              flex
              justify-center
              gap-1
              sm:gap-1.5
            "
          >
            {rowIndex ===
              2 && (
              <button
                disabled={
                  disabled
                }
                onClick={
                  onEnter
                }
                className="
                  h-11
                  min-w-[58px]
                  border
                  border-[#1b1917]
                  bg-[#1b1917]
                  px-2
                  font-mono
                  text-[10px]
                  tracking-wider
                  text-white
                  disabled:opacity-50
                  sm:h-12
                  sm:min-w-[72px]
                "
              >
                ENTER
              </button>
            )}

            {row
              .split("")
              .map(
                (letter) => {
                  const status =
                    statuses.get(
                      letter,
                    ) ??
                    "empty";

                  return (
                    <button
                      key={
                        letter
                      }
                      disabled={
                        disabled
                      }
                      onClick={() =>
                        onLetter(
                          letter,
                        )
                      }
                      className={`
                        h-11
                        min-w-0
                        flex-1
                        border
                        text-xs
                        font-semibold
                        sm:h-12
                        sm:max-w-12
                        sm:text-sm
                        ${statusStyles[status]}
                        disabled:opacity-60
                      `}
                    >
                      {letter}
                    </button>
                  );
                },
              )}

            {rowIndex ===
              2 && (
              <button
                disabled={
                  disabled
                }
                onClick={
                  onDelete
                }
                aria-label="Delete letter"
                className="
                  grid
                  h-11
                  min-w-[46px]
                  place-items-center
                  border
                  border-[#d7d0c7]
                  bg-[#f1ece6]
                  text-[#1b1917]
                  disabled:opacity-50
                  sm:h-12
                  sm:min-w-[56px]
                "
              >
                <Delete
                  size={17}
                  strokeWidth={
                    1.8
                  }
                />
              </button>
            )}
          </div>
        ),
      )}
    </div>
  );
}