import { motion } from "motion/react";

import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";

import type {
  Commitment,
} from "../types/commitment";

type Props = {
  commitment: Commitment;
  onHome: () => void;
  onDone: () => void;
  onPostpone: () => void;
  onDetails: () => void;
};

export function DueScreen({
  commitment,
  onHome,
  onDone,
  onPostpone,
  onDetails,
}: Props) {
  const time =
    new Intl.DateTimeFormat(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      },
    ).format(
      commitment.scheduledFor,
    );

  return (
    <AppShell
      onLogoClick={onHome}
      right={
        <button
          onClick={onDetails}
          className="text-[12px] text-[#71717a]"
        >
          Details
        </button>
      }
    >
      <div
        className={[
          "flex flex-1",
          "items-center justify-center",
          "px-5 py-20",
        ].join(" ")}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className={[
            "w-full max-w-[420px]",
            "text-center",
          ].join(" ")}
        >
          <p
            className={[
              "text-[11px]",
              "font-medium uppercase",
              "tracking-[0.08em]",
              "text-[#71717a]",
            ].join(" ")}
          >
            Later is now.
          </p>

          <h1
            className={[
              "mt-5 text-[28px]",
              "font-semibold",
              "tracking-[-0.04em]",
            ].join(" ")}
          >
            {commitment.title}
          </h1>

          <p className="mt-2 text-[13px] text-[#71717a]">
            You said {time}.
          </p>

          <div className="mt-9 space-y-2">
            <Button
              className="w-full"
              onClick={onDone}
            >
              Done ✓
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={onPostpone}
            >
              Not yet
            </Button>
          </div>

          <p className="mt-8 text-[11px] text-[#a1a1aa]">
            Postponed{" "}
            {commitment.postponements}{" "}
            {commitment.postponements ===
            1
              ? "time"
              : "times"}
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
}