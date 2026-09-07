import { Button } from "../components/Button";
import {
  formatNaira,
  formatNumber,
} from "../lib/currency";
import type { MarketRecords } from "../types/game";

interface Props {
  records: MarketRecords;
  onPlay: () => void;
}

export function RecordsScreen({
  records,
  onPlay,
}: Props) {
  return (
    <main className="mx-auto max-w-[760px] px-5 pt-8">
      <div
        className="
          rounded-xl border border-[#bcc7bd]
          bg-[#f5f4f1] px-5 py-3 font-mono
          text-[10px] font-bold tracking-[0.13em]
          text-[#677068]
        "
      >
        YOU DON PLAY: {records.gamesPlayed} TIMES -
        STATUS: PRICE CHECKED
      </div>

      <section
        className="
          mt-7 overflow-hidden rounded-2xl
          border border-[#b9c7bb] bg-white shadow-lg
        "
      >
        <div
          className="
            border-b border-[#cbd3cb] px-7 py-5
            font-mono text-[10px] font-bold
            tracking-[0.13em]
          "
        >
          * YOUR MARKET RECORD
        </div>

        <div className="p-7">
          <h1
            className="
              text-4xl font-black tracking-[-0.05em]
              sm:text-5xl
            "
          >
            HOW YOU DEY PRICE
          </h1>

          <p
            className="
              mt-3 max-w-xl leading-7
              text-[#565e57]
            "
          >
            Your best runs across Naija food, market,
            gadget, home and Lagos life cards.
          </p>

          <div
            className="
              mt-8 grid overflow-hidden rounded-xl
              border border-[#bac7bb] sm:grid-cols-3
            "
          >
            <Record
              index="01"
              label="BEST SCORE"
              value={formatNumber(records.bestScore)}
              accent
            />

            <Record
              index="02"
              label="BEST ACCURACY"
              value={`${records.bestAccuracy}%`}
            />

            <Record
              index="03"
              label="BEST STREAK"
              value={`x${records.bestStreak}`}
              amber
            />

            <Record
              index="04"
              label="CLOSEST CARD"
              value={
                records.closestPercent === null
                  ? "-"
                  : `${records.closestPercent.toFixed(1)}%`
              }
              accent
            />

            <Record
              index="05"
              label="GAMES PLAYED"
              value={String(records.gamesPlayed)}
            />

            <Record
              index="06"
              label="VALUE GUESSED"
              value={formatNaira(
                records.totalValueAppraised,
              )}
              amber
            />
          </div>

          <Button
            className="mt-8 w-full"
            onClick={onPlay}
          >
            RUN AM AGAIN
          </Button>
        </div>

        <div
          className="
            border-t border-[#d3d7d2]
            bg-[#f6f5f2] px-7 py-4
            font-mono text-[9px] font-bold
            tracking-[0.13em] text-[#6c746d]
          "
        >
          NAIJA PRICE CHECK - ACCURACY BOARD
        </div>
      </section>
    </main>
  );
}

function Record({
  index,
  label,
  value,
  accent = false,
  amber = false,
}: {
  index: string;
  label: string;
  value: string;
  accent?: boolean;
  amber?: boolean;
}) {
  return (
    <div
      className="
        min-h-40 border-b border-[#c7d0c7]
        p-5 sm:border-r
      "
    >
      <div
        className="
          font-mono text-[9px] font-bold
          tracking-[0.12em] text-[#727b73]
        "
      >
        CARD {index}
      </div>

      <div
        className={[
          "mt-6 break-words font-mono text-3xl font-black",
          accent ? "text-[#075d38]" : "",
          amber ? "text-[#955800]" : "",
        ].join(" ")}
      >
        {value}
      </div>

      <div
        className="
          mt-2 font-mono text-[9px] font-bold
          tracking-[0.11em]
        "
      >
        {label}
      </div>
    </div>
  );
}
