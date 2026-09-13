import { ArrowUpRight } from "lucide-react";

import { Countdown } from "./countdown";

import {
  formatCommitmentDate,
} from "../lib/time";

import type {
  Commitment,
} from "../types/commitment";

type Props = {
  commitment: Commitment;
  onClick: () => void;
};

export function CommitmentCard({
  commitment,
  onClick,
}: Props) {
  const due =
    commitment.status === "due";

  return (
    <button
      onClick={onClick}
      className={[
        "group flex w-full",
        "items-center justify-between",
        "rounded-xl border",
        "border-[#e4e4e7]",
        "bg-white px-5 py-5",
        "text-left",
        "transition-colors",
        "hover:border-[#c4c4c7]",
      ].join(" ")}
    >
      <div className="min-w-0">
        <p
          className={[
            "truncate text-[15px]",
            "font-medium",
          ].join(" ")}
        >
          {commitment.title}
        </p>

        <p
          className={[
            "mt-1 text-[12px]",
            "text-[#a1a1aa]",
          ].join(" ")}
        >
          {formatCommitmentDate(
            commitment.scheduledFor,
          )}
        </p>
      </div>

      <div className="ml-5 flex items-center gap-3">
        <p
          className={[
            "whitespace-nowrap",
            "text-[12px]",
            due
              ? "font-medium text-[#111111]"
              : "text-[#71717a]",
          ].join(" ")}
        >
          {due ? (
            "Later is now."
          ) : (
            <Countdown
              timestamp={
                commitment.scheduledFor
              }
            />
          )}
        </p>

        <ArrowUpRight
          className={[
            "h-4 w-4",
            "text-[#a1a1aa]",
            "transition-transform",
            "group-hover:translate-x-0.5",
            "group-hover:-translate-y-0.5",
          ].join(" ")}
        />
      </div>
    </button>
  );
}