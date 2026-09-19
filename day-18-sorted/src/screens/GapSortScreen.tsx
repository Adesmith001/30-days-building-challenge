import {
  useState,
} from "react";

import {
  motion,
} from "motion/react";

import {
  AppShell,
} from "../components/AppShell";

import {
  PrimaryButton,
} from "../components/PrimaryButton";

import {
  gapPuzzles,
} from "../data/gap";

function correctGap(
  values: number[],
  target: number,
) {
  return values.filter(
    (value) =>
      value < target,
  ).length;
}

export function GapSortScreen({
  onHome,
}: {
  onHome: () => void;
}) {
  const [
    round,
    setRound,
  ] =
    useState(0);

  const [
    score,
    setScore,
  ] =
    useState(0);

  const [
    selected,
    setSelected,
  ] =
    useState<
      number | null
    >(null);

  const [
    locked,
    setLocked,
  ] =
    useState(false);

  const puzzle =
    gapPuzzles[
      round
    ];

  const done =
    round >=
    gapPuzzles.length;

  if (done) {
    return (
      <AppShell
        hideNav
        onNavigate={() =>
          onHome()
        }
      >
        <div
          className="
            flex
            flex-1
            flex-col
            justify-center
            text-center
          "
        >
          <span
            className="
              font-display
              text-xs
              font-bold
              tracking-widest
              text-emerald-300
            "
          >
            WHERE DOES IT GO?
            COMPLETE
          </span>

          <h1
            className="
              mt-2
              font-display
              text-4xl
              font-bold
            "
          >
            GAP MASTER.
          </h1>

          <div
            className="
              mt-5
              font-display
              text-6xl
              font-bold
              text-gold
            "
          >
            {score.toLocaleString()}
          </div>

          <p
            className="
              mt-2
              text-sm
              text-slate-400
            "
          >
            out of 5,000
          </p>

          <div
            className="
              mt-8
            "
          >
            <PrimaryButton
              onClick={
                onHome
              }
            >
              BACK HOME
            </PrimaryButton>
          </div>
        </div>
      </AppShell>
    );
  }

  const gap =
    correctGap(
      puzzle.anchors.map(
        (item) =>
          item.value,
      ),
      puzzle.target.value,
    );

  const isCorrect =
    selected === gap;

  const lock = () => {
    if (
      selected === null ||
      locked
    ) {
      return;
    }

    setLocked(true);

    if (
      selected === gap
    ) {
      setScore(
        (value) =>
          value + 1000,
      );
    }
  };

  const next = () => {
    setRound(
      (value) =>
        value + 1,
    );

    setSelected(null);
    setLocked(false);
  };

  return (
    <AppShell
      hideNav
      onNavigate={() =>
        onHome()
      }
    >
      <div
        className="
          space-y-5
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-3
            py-2
            font-display
            text-xs
            font-bold
          "
        >
          <span>
            {round + 1}
            {" / "}
            {gapPuzzles.length}
          </span>

          <span
            className="
              text-gold
            "
          >
            SCORE
            {" "}
            {score.toLocaleString()}
          </span>
        </div>

        <section
          className="
            text-center
          "
        >
          <span
            className="
              font-display
              text-[10px]
              font-bold
              tracking-widest
              text-emerald-300
            "
          >
            WHERE DOES IT GO?
          </span>

          <h1
            className="
              mt-2
              font-display
              text-2xl
              font-bold
              text-gold
            "
          >
            {puzzle.prompt}
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-slate-400
            "
          >
            Choose the gap where
            the new item belongs.
          </p>
        </section>

        <div
          className="
            tactile-tile
            relative
            mx-auto
            aspect-[1.8]
            w-full
            overflow-hidden
            rounded-2xl
            bg-white
            text-ink
          "
        >
          {puzzle.image && (
            <>
              <img
                src={
                  puzzle.image
                }
                alt=""
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/90
                  to-black/10
                "
              />
            </>
          )}

          <div
            className={`
              absolute
              inset-0
              flex
              items-end
              p-5
              ${
                puzzle.image
                  ? "text-white"
                  : "text-ink"
              }
            `}
          >
            <div>
              <span
                className="
                  font-display
                  text-[10px]
                  font-bold
                  opacity-60
                "
              >
                NEW ITEM
              </span>

              <h2
                className="
                  mt-1
                  font-display
                  text-3xl
                  font-bold
                "
              >
                {
                  puzzle
                    .target
                    .label
                }
              </h2>
            </div>
          </div>
        </div>

        <div
          className="
            overflow-x-auto
            pb-2
          "
        >
          <div
            className="
              flex
              min-w-[500px]
              items-stretch
              gap-2
            "
          >
            {Array.from({
              length: 5,
            }).map(
              (
                _,
                index,
              ) => (
                <div
                  key={index}
                  className="
                    contents
                  "
                >
                  <button
                    onClick={() =>
                      !locked &&
                      setSelected(
                        index,
                      )
                    }
                    className={`
                      w-12
                      shrink-0
                      rounded-xl
                      border
                      font-display
                      text-lg
                      font-bold
                      transition
                      ${
                        selected ===
                        index
                          ? `
                            border-gold
                            bg-gold
                            text-ink
                          `
                          : `
                            border-white/10
                            bg-well
                            text-slate-500
                          `
                      }
                      ${
                        locked &&
                        index === gap
                          ? `
                            ring-2
                            ring-emerald-400
                          `
                          : ""
                      }
                    `}
                  >
                    {index + 1}
                  </button>

                  {index < 4 && (
                    <div
                      className="
                        flex
                        w-24
                        shrink-0
                        flex-col
                        justify-center
                        rounded-xl
                        bg-white
                        p-2
                        text-center
                        text-ink
                      "
                    >
                      <span
                        className="
                          font-display
                          text-xs
                          font-bold
                          leading-tight
                        "
                      >
                        {
                          puzzle
                            .anchors[
                              index
                            ]
                            .label
                        }
                      </span>

                      {locked && (
                        <span
                          className="
                            mt-1
                            text-[9px]
                            text-slate-500
                          "
                        >
                          {
                            puzzle
                              .anchors[
                                index
                              ]
                              .displayValue
                          }
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>

        {locked && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className={`
              rounded-2xl
              border
              p-4
              text-center
              ${
                isCorrect
                  ? `
                    border-emerald-400/30
                    bg-emerald-400/10
                  `
                  : `
                    border-amber-400/30
                    bg-amber-400/10
                  `
              }
            `}
          >
            <strong
              className="
                font-display
                text-xl
              "
            >
              {isCorrect
                ? "EXACT GAP. +1,000"
                : `GAP ${gap + 1} WAS IT.`}
            </strong>

            <p
              className="
                mt-1
                text-sm
                text-slate-300
              "
            >
              {
                puzzle
                  .target
                  .displayValue
              }
              {" · "}
              {puzzle.fact}
            </p>
          </motion.div>
        )}

        <PrimaryButton
          onClick={
            locked
              ? next
              : lock
          }
          disabled={
            !locked &&
            selected === null
          }
        >
          {locked
            ? "NEXT →"
            : "LOCK GAP →"}
        </PrimaryButton>
      </div>
    </AppShell>
  );
}