import { motion } from "motion/react";
import {
  formatNaira,
  formatNumber,
} from "../lib/currency";
import type { RoundResult } from "../types/game";
import { Button } from "./Button";

interface Props {
  result: RoundResult;
  onNext: () => void;
}

export function ResultCard({
  result,
  onNext,
}: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
      className="
        relative z-20 rounded-2xl border
        border-[#9fb4a5] bg-[#fffefa] p-5
        shadow-[0_22px_45px_rgba(22,31,23,0.12)]
      "
    >
      <div
        className="
          flex items-center justify-between border-b
          border-[#d6ddd6] pb-4 font-mono
          text-[10px] font-bold tracking-[0.13em]
          text-[#687269]
        "
      >
        <span>
          * {result.item.category} - PRICE CHECKED
        </span>

        <span>{result.item.location}</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <img
          src={result.item.image}
          alt=""
          className="
            h-20 w-24 rounded-lg object-cover
            sm:h-24 sm:w-28
          "
        />

        <div>
          <h2 className="text-2xl font-black">
            {result.item.name}
          </h2>

          <p className="mt-1 text-sm text-[#646b65]">
            {result.item.context}
          </p>

          <div
            className="
              mt-2 font-mono text-[10px] font-bold
              tracking-[0.12em] text-[#075d38]
            "
          >
            * PRICE CHECKED
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div
          className="
            rounded-xl border border-[#ded7cc]
            bg-[#faf7f1] p-4
          "
        >
          <Label>YOU TALK</Label>

          <div
            className="
              mt-3 font-mono text-2xl font-black
              text-[#8e5300]
            "
          >
            {formatNaira(result.guess ?? 0)}
          </div>
        </div>

        <div
          className="
            rounded-xl border border-[#9fb8a7]
            bg-[#f0f6f1] p-4
          "
        >
          <Label>REAL PRICE</Label>

          <div
            className="
              mt-3 font-mono text-2xl font-black
              text-[#075d38]
            "
          >
            {formatNaira(result.item.actualPrice)}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat
          label="ACCURACY"
          value={`${result.accuracy}%`}
        />

        <Stat
          label="POINTS"
          value={`+${formatNumber(result.points)}`}
          green
        />

        <Stat
          label="VARIANCE"
          value={`${Math.round(result.errorPercent)}%`}
        />
      </div>

      <div
        className="
          mt-4 rounded-xl border border-dashed
          border-[#c9d0c8] bg-[#faf9f6]
          px-4 py-4
        "
      >
        <span
          className="
            font-mono text-[10px] font-bold
            tracking-[0.13em] text-[#737b74]
          "
        >
          TALK TRUE:
        </span>

        <strong className="ml-2 text-lg">
          {result.verdict}
        </strong>
      </div>

      {result.speedBonus > 0 && (
        <div
          className="
            mt-3 rounded-lg border border-[#efad65]
            bg-[#fff0dc] px-4 py-2
            text-center font-mono text-[10px]
            font-bold tracking-[0.13em]
            text-[#9a5704]
          "
        >
          SHARP SHARP - SPEED BONUS +
          {result.speedBonus}
        </div>
      )}

      <Button className="mt-5 w-full" onClick={onNext}>
        NEXT CARD
      </Button>
    </motion.article>
  );
}

function Label({ children }: { children: string }) {
  return (
    <div
      className="
        font-mono text-[10px] font-bold
        tracking-[0.13em] text-[#697269]
      "
    >
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-lg border p-3 text-center",
        green
          ? "border-[#075d38] bg-[#075d38] text-white"
          : "border-[#d5dad4] bg-white",
      ].join(" ")}
    >
      <div className="font-mono text-[8px] font-bold">
        {label}
      </div>

      <div className="mt-1 font-mono text-sm font-black">
        {value}
      </div>
    </div>
  );
}
