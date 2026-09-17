import {
  ArrowRight,
  CalendarDays,
  Flame,
  Shuffle,
} from "lucide-react";

import type {
  GameMode,
  GameStats,
} from "../types/game";

type Props = {
  stats: GameStats;
  dailyPlayed: boolean;
  dateKey: string;
  onStart:
    (mode: GameMode) => void;
};

export function HomeScreen({
  stats,
  dailyPlayed,
  dateKey,
  onStart,
}: Props) {
  return (
    <main
      className="
        mx-auto
        w-full
        max-w-[820px]
        flex-1
        px-4
        py-7
        sm:px-8
        sm:py-10
      "
    >
      <div
        className="
          mb-6
          flex
          items-center
          justify-between
          border-b
          border-[#d9d2c8]
          pb-4
          font-mono
          text-[10px]
          tracking-[0.15em]
          text-[#69645e]
        "
      >
        <span
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#174c3b]
            "
          />

          NAIJA WORD GAME ·
          DAY 17 OF 30
        </span>

        <span
          className="
            hidden sm:inline
          "
        >
          5 TRIES · 1 WORD ·
          NO YAWA
        </span>
      </div>

      <h1
        className="
          max-w-3xl
          font-serif
          text-[clamp(3.25rem,8vw,5.8rem)]
          leading-[0.86]
          tracking-[-0.045em]
          text-[#161412]
        "
      >
        FIND THE
        <br />
        NAIJA WORD.
      </h1>

      <p
        className="
          mt-5
          max-w-xl
          text-base
          leading-7
          text-[#55514b]
          sm:text-base
        "
      >
        We give you the meaning.
        You get five tries to find
        the Nigerian word — slang,
        pidgin, food, street talk
        and culture.
      </p>

      <div
        className="
          mt-7
          grid
          border
          border-[#cec6bc]
          md:grid-cols-2
        "
      >
        <section
          className="
            p-4
            sm:p-5
            md:border-r
            md:border-[#cec6bc]
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#d9d2c8]
              pb-3
            "
          >
            <span
              className="
                font-mono
                text-[10px]
                tracking-[0.15em]
                text-[#6d6963]
              "
            >
              MODE · 01
            </span>

            <CalendarDays
              size={17}
              strokeWidth={
                1.5
              }
              className="
                text-[#174c3b]
              "
            />
          </div>

          <h2
            className="
              mt-4
              font-serif
              text-2xl
            "
          >
            Daily Sabi
          </h2>

          <p
            className="
              mt-2
              min-h-12
              text-sm
              leading-6
              text-[#5b5751]
            "
          >
            Same hidden word for
            everybody today. One
            counted attempt on
            this device.
          </p>

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <span
              className="
                font-mono
                text-[9px]
                tracking-[0.12em]
                text-[#77716a]
              "
            >
              {dateKey} · UTC
            </span>

            <button
              disabled={
                dailyPlayed
              }
              onClick={() =>
                onStart(
                  "daily",
                )
              }
              className="
                inline-flex
                items-center
                gap-2
                bg-[#174c3b]
                px-4
                py-3
                font-mono
                text-[10px]
                tracking-[0.12em]
                text-white
                disabled:cursor-not-allowed
                disabled:bg-[#d7d0c7]
                disabled:text-[#746f68]
              "
            >
              {dailyPlayed
                ? "DONE TODAY"
                : "PLAY DAILY"}

              {!dailyPlayed && (
                <ArrowRight
                  size={14}
                />
              )}
            </button>
          </div>
        </section>

        <section
          className="
            border-t
            border-[#cec6bc]
            p-4
            sm:p-5
            md:border-t-0
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#d9d2c8]
              pb-3
            "
          >
            <span
              className="
                font-mono
                text-[10px]
                tracking-[0.15em]
                text-[#6d6963]
              "
            >
              MODE · 02
            </span>

            <Shuffle
              size={17}
              strokeWidth={
                1.5
              }
              className="
                text-[#174c3b]
              "
            />
          </div>

          <h2
            className="
              mt-4
              font-serif
              text-2xl
            "
          >
            Sabi Run
          </h2>

          <p
            className="
              mt-2
              min-h-12
              text-sm
              leading-6
              text-[#5b5751]
            "
          >
            Random words,
            endless rounds.
            Build your streak
            and chase cleaner
            solves.
          </p>

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-2
                font-mono
                text-[9px]
                tracking-[0.12em]
                text-[#77716a]
              "
            >
              <Flame
                size={13}
              />

              STREAK{" "}
              {stats.currentStreak}
            </span>

            <button
              onClick={() =>
                onStart(
                  "run",
                )
              }
              className="
                inline-flex
                items-center
                gap-2
                border
                border-[#1b1917]
                px-4
                py-3
                font-mono
                text-[10px]
                tracking-[0.12em]
                hover:bg-[#1b1917]
                hover:text-white
              "
            >
              START RUN

              <ArrowRight
                size={14}
              />
            </button>
          </div>
        </section>
      </div>

      <div
        className="
          mt-6
          grid
          grid-cols-3
          gap-4
          border-t
          border-[#d9d2c8]
          pt-4
          font-mono
          text-[9px]
          tracking-[0.13em]
          text-[#6d6963]
        "
      >
        <div>
          <span
            className="
              block
              text-[#999189]
            "
          >
            01 / FEEDBACK
          </span>

          <span
            className="
              mt-1 block
              text-[#24211e]
            "
          >
            WORDLE RULES
          </span>
        </div>

        <div>
          <span
            className="
              block
              text-[#999189]
            "
          >
            02 / CONTENT
          </span>

          <span
            className="
              mt-1 block
              text-[#24211e]
            "
          >
            40+ NAIJA WORDS
          </span>
        </div>

        <div>
          <span
            className="
              block
              text-[#999189]
            "
          >
            03 / STORAGE
          </span>

          <span
            className="
              mt-1 block
              text-[#24211e]
            "
          >
            LOCAL ONLY
          </span>
        </div>
      </div>
    </main>
  );
}
