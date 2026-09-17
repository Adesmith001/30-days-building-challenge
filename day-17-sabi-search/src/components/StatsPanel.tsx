import type {
  GameStats,
} from "../types/game";

import {
  ModalShell,
} from "./ModalShell";

type Props = {
  stats: GameStats;
  onClose: () => void;
};

export function StatsPanel({
  stats,
  onClose,
}: Props) {
  const winRate =
    stats.played
      ? Math.round(
          (
            stats.wins /
            stats.played
          ) * 100,
        )
      : 0;

  const average =
    stats.played
      ? (
          stats.totalAttempts /
          stats.played
        ).toFixed(1)
      : "—";

  return (
    <ModalShell
      eyebrow="LOCAL RECORD · DEVICE ONLY"
      title="Your Sabi"
      onClose={onClose}
    >
      <div
        className="
          grid grid-cols-4
          border-b
          border-[#d9d2c8]
          py-6
          text-center
        "
      >
        {[
          [
            stats.played,
            "PLAYED",
          ],
          [
            `${winRate}%`,
            "WIN RATE",
          ],
          [
            stats.currentStreak,
            "STREAK",
          ],
          [
            stats.maxStreak,
            "BEST",
          ],
        ].map(
          ([
            value,
            label,
          ]) => (
            <div
              key={label}
            >
              <div
                className="
                  font-serif
                  text-2xl
                  sm:text-3xl
                "
              >
                {value}
              </div>

              <div
                className="
                  mt-1
                  font-mono
                  text-[8px]
                  tracking-[0.14em]
                  text-[#77716a]
                "
              >
                {label}
              </div>
            </div>
          ),
        )}
      </div>

      <div className="py-6">
        <div
          className="
            mb-4
            flex
            justify-between
            font-mono
            text-[10px]
            tracking-[0.14em]
            text-[#6d6963]
          "
        >
          <span>
            GUESS DISTRIBUTION
          </span>

          <span>
            AVG {average}
          </span>
        </div>

        <div
          className="
            space-y-2
          "
        >
          {[1, 2, 3, 4, 5].map(
            (guess) => {
              const count =
                stats
                  .distribution[
                  String(guess)
                ] ?? 0;

              const max =
                Math.max(
                  1,
                  ...Object.values(
                    stats.distribution,
                  ),
                );

              return (
                <div
                  key={
                    guess
                  }
                  className="
                    grid
                    grid-cols-[18px_1fr_28px]
                    items-center
                    gap-2
                    text-xs
                  "
                >
                  <span
                    className="
                      font-mono
                    "
                  >
                    {guess}
                  </span>

                  <div
                    className="
                      h-6
                      bg-[#eee8e1]
                    "
                  >
                    <div
                      className="
                        grid
                        h-full
                        min-w-6
                        place-items-center
                        bg-[#174c3b]
                        text-[10px]
                        text-white
                      "
                      style={{
                        width:
                          `${Math.max(
                            8,
                            (
                              count /
                              max
                            ) *
                              100,
                          )}%`,
                      }}
                    />
                  </div>

                  <span
                    className="
                      text-right
                      font-mono
                    "
                  >
                    {count}
                  </span>
                </div>
              );
            },
          )}
        </div>
      </div>

      <div
        className="
          border-t
          border-[#d9d2c8]
          pt-5
        "
      >
        <p
          className="
            mb-3
            font-mono
            text-[10px]
            tracking-[0.14em]
            text-[#6d6963]
          "
        >
          RECENT RUNS
        </p>

        {stats.history
          .length === 0 ? (
          <p
            className="
              text-sm
              text-[#6d6963]
            "
          >
            No record yet.
            Your first word
            is waiting.
          </p>
        ) : (
          <div
            className="
              divide-y
              divide-[#e1dbd3]
            "
          >
            {stats.history
              .slice(0, 6)
              .map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="
                      grid
                      grid-cols-[1fr_auto_auto]
                      gap-4
                      py-3
                      text-xs
                    "
                  >
                    <span
                      className="
                        font-mono
                        tracking-wide
                      "
                    >
                      {item.mode ===
                      "daily"
                        ? "DAILY"
                        : "RUN"}
                      {" · "}
                      {item.date.slice(
                        5,
                      )}
                    </span>

                    <span>
                      {item.won
                        ? `${item.attempts}/5`
                        : "X/5"}
                    </span>

                    <span
                      className="
                        font-mono
                        text-[#174c3b]
                      "
                    >
                      {item.score}
                    </span>
                  </div>
                ),
              )}
          </div>
        )}
      </div>
    </ModalShell>
  );
}