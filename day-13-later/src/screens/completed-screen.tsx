import { Check } from "lucide-react";
import { motion } from "motion/react";

import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";

import type {
  Commitment,
} from "../types/commitment";

type Props = {
  commitment: Commitment;
  onNext: () => void;
  onHome: () => void;
};

export function CompletedScreen({
  commitment,
  onNext,
  onHome,
}: Props) {
  const completedTime =
    commitment.completedAt
      ? new Intl.DateTimeFormat(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
          },
        ).format(
          commitment.completedAt,
        )
      : "";

  return (
    <AppShell
      onLogoClick={onHome}
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
          <motion.div
            initial={{
              scale: 0.75,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: 0.1,
            }}
            className={[
              "mx-auto flex h-10",
              "w-10 items-center",
              "justify-center",
              "rounded-full border",
              "border-[#a1a1aa]",
            ].join(" ")}
          >
            <Check className="h-4 w-4" />
          </motion.div>

          <h1
            className={[
              "mt-5 text-[32px]",
              "font-semibold",
              "tracking-[-0.04em]",
            ].join(" ")}
          >
            Done.
          </h1>

          <p className="mt-2 text-[14px] text-[#71717a]">
            Turns out “later”
            eventually arrived.
          </p>

          <div
            className={[
              "mt-8 rounded-xl",
              "border",
              "border-[#e4e4e7]",
              "bg-white p-5",
              "text-left",
            ].join(" ")}
          >
            <p className="text-[14px] font-medium">
              {commitment.title}
            </p>

            <p className="mt-2 text-[11px] text-[#71717a]">
              Completed at{" "}
              {completedTime}
            </p>

            <p className="mt-1 text-[11px] text-[#a1a1aa]">
              You postponed this{" "}
              {commitment.postponements}{" "}
              {commitment.postponements ===
              1
                ? "time."
                : "times."}
            </p>
          </div>

          <Button
            className="mt-6 w-full"
            onClick={onNext}
          >
            What's next? →
          </Button>
        </motion.div>
      </div>
    </AppShell>
  );
}