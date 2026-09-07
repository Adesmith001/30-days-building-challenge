import { useMemo, useRef } from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "../components/Button";
import {
  formatNaira,
  formatNumber,
} from "../lib/currency";
import {
  getRank,
  pointsToNextRank,
} from "../lib/ranks";
import {
  saveResultCard,
  shareResultCard,
} from "../lib/share";
import type { RoundResult } from "../types/game";

interface Props {
  results: RoundResult[];
  onReplay: () => void;
  onRecords: () => void;
  onHome: () => void;
}

export function ResultsScreen({
  results,
  onReplay,
  onRecords,
  onHome,
}: Props) {
  const shareRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    const answered = results.filter(
      (result) => !result.skipped,
    );

    const skipped = results.length - answered.length;

    const score = results.reduce(
      (total, result) => total + result.points,
      0,
    );

    const accuracy = answered.length
      ? Math.round(
          answered.reduce(
            (total, result) =>
              total + result.accuracy,
            0,
          ) / answered.length,
        )
      : 0;

    const bestStreak = Math.max(
      0,
      ...results.map((result) => result.nextStreak),
    );

    const sorted = [...answered].sort(
      (a, b) => a.errorPercent - b.errorPercent,
    );

    const under = answered.filter(
      (result) => result.direction === "low",
    ).length;

    const high = answered.filter(
      (result) => result.direction === "high",
    ).length;

    return {
      answered,
      skipped,
      score,
      accuracy,
      bestStreak,
      best: sorted[0],
      worst: sorted.at(-1),
      under,
      high,
    };
  }, [results]);

  const rank = getRank(stats.score);
  const nextPoints = pointsToNextRank(stats.score);

  const instinct =
    stats.under > stats.high
      ? "YOU DEY PRICE THINGS TOO LOW."
      : stats.high > stats.under
        ? "YOU DEY FEAR LAGOS PRICE TOO MUCH."
        : "YOUR PRICE SENSE BALANCE.";

  return (
    <main className="mx-auto max-w-[760px] px-5 pt-8">
      <div
        ref={shareRef}
        className="
          rounded-2xl border border-[#d2cfc7]
          bg-[#fffefa] p-6 shadow-xl sm:p-8
        "
      >
        <div
          className="
            flex justify-between border-b
            border-[#d4d8d2] pb-4 font-mono
            text-[10px] font-bold tracking-[0.14em]
            text-[#687169]
          "
        >
          <span>* PRICE RUN RESULT</span>
          <span>NAIJA CHECK #07</span>
        </div>

        <div className="mt-7 flex justify-between gap-5">
          <div>
            <div
              className="
                font-mono text-xs font-bold
                tracking-[0.12em] text-[#747d75]
              "
            >
              FINAL SCORE
            </div>

            <div
              className="
                mt-1 font-mono text-5xl font-black
                tracking-[-0.05em]
              "
            >
              {formatNumber(stats.score)}
              <span
                className="
                  ml-2 text-sm tracking-normal
                  text-[#075d38]
                "
              >
                PTS
              </span>
            </div>
          </div>

          <div className="text-right">
            <div
              className="
                rounded bg-[#075d38] px-5 py-2
                font-mono text-xs font-bold
                tracking-[0.12em] text-white
              "
            >
              {rank.name}
            </div>

            <div
              className="
                mt-2 font-mono text-[9px] font-bold
                tracking-[0.1em] text-[#737c74]
              "
            >
              LEVEL: PRICE AM
            </div>
          </div>
        </div>

        <div
          className="
            mt-7 rounded-xl border border-[#ccd4cc]
            bg-[#f5f4f1] p-5
          "
        >
          <div
            className="
              font-mono text-[10px] font-bold
              tracking-[0.13em] text-[#075d38]
            "
          >
            YOUR PRICE SENSE
          </div>

          <div className="mt-2 text-xl font-black">
            {instinct}
          </div>

          <p className="mt-2 text-sm text-[#59615b]">
            {stats.under} guesses were below market.
            {" "}
            {stats.high} were above.
          </p>
        </div>

        <div
          className="
            mt-6 grid grid-cols-2 gap-px
            overflow-hidden rounded-xl border
            border-[#d3d7d1] bg-[#d3d7d1]
            sm:grid-cols-3
          "
        >
          <Metric
            label="PLAYED"
            value={`${stats.answered.length} / 10`}
          />

          <Metric
            label="PASSED"
            value={String(stats.skipped)}
          />

          <Metric
            label="ACCURACY"
            value={`${stats.accuracy}%`}
            green
          />

          <Metric
            label="BEST STREAK"
            value={`×${stats.bestStreak}`}
          />

          <Metric
            label="BEST GUESS"
            value={
              stats.best
                ? `${stats.best.errorPercent.toFixed(1)}%`
                : "—"
            }
          />

          <Metric
            label="WORST MISS"
            value={
              stats.worst
                ? `${stats.worst.errorPercent.toFixed(0)}%`
                : "—"
            }
          />
        </div>

        {stats.best && (
          <div
            className="
              mt-6 border-t border-[#d5d9d4]
              pt-5
            "
          >
            <div
              className="
                font-mono text-[10px] font-bold
                tracking-[0.13em] text-[#6d766e]
              "
            >
              BEST CARD
            </div>

            <div className="mt-1 text-xl font-black">
              {stats.best.item.name}
            </div>

            <div className="mt-1 text-sm text-[#616962]">
              Real price{" "}
              {formatNaira(stats.best.item.actualPrice)}
            </div>
          </div>
        )}

        {nextPoints > 0 && (
          <div
            className="
              mt-6 rounded-lg border border-[#ebad67]
              bg-[#fff0dc] px-4 py-3 text-center
              font-mono text-[10px] font-bold
              tracking-[0.12em] text-[#8c5008]
            "
          >
            {formatNumber(nextPoints)} POINTS TO NEXT LEVEL
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Button onClick={onReplay}>
          PLAY AGAIN
        </Button>

        <Button
          variant="secondary"
          onClick={onRecords}
        >
          SEE RECORD
        </Button>

        <Button
          variant="secondary"
          onClick={onHome}
        >
          GO HOME
        </Button>
      </div>

      <div className="mt-3 flex justify-end gap-3">
        <Button
          variant="secondary"
          className="w-13 px-0"
          aria-label="Share result"
          title="Share result"
          onClick={() => {
            if (shareRef.current) {
              void shareResultCard(shareRef.current);
            }
          }}
        >
          <Share2 size={18} aria-hidden="true" />
        </Button>

        <Button
          variant="secondary"
          className="w-13 px-0"
          aria-label="Save result image"
          title="Save result image"
          onClick={() => {
            if (shareRef.current) {
              void saveResultCard(shareRef.current);
            }
          }}
        >
          <Download size={18} aria-hidden="true" />
        </Button>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="bg-[#fffefa] p-5">
      <div
        className="
          font-mono text-[9px] font-bold
          tracking-[0.12em] text-[#747c75]
        "
      >
        {label}
      </div>

      <div
        className={[
          "mt-2 font-mono text-2xl font-black",
          green ? "text-[#075d38]" : "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}
