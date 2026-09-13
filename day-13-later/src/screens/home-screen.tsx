import {
  type FormEvent,
  useState,
} from "react";

import { motion } from "motion/react";

import { AppShell } from "../components/app-shell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

type Props = {
  onContinue: (task: string) => void;
  onViewCommitments: () => void;
  hasCommitments: boolean;
};

export function HomeScreen({
  onContinue,
  onViewCommitments,
  hasCommitments,
}: Props) {
  const [task, setTask] = useState("");

  function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    const value = task.trim();

    if (!value) {
      return;
    }

    onContinue(value);
  }

  return (
    <AppShell
      onLogoClick={() => undefined}
      right={
        hasCommitments ? (
          <button
            onClick={
              onViewCommitments
            }
            className={[
              "text-[12px] font-medium",
              "text-[#71717a]",
              "transition-colors",
              "hover:text-[#111111]",
            ].join(" ")}
          >
            My commitments
          </button>
        ) : null
      }
    >
      <div
        className={[
          "flex flex-1 items-center",
          "px-5 py-20",
        ].join(" ")}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto w-full max-w-[680px]"
        >
          <h1
            className={[
              "max-w-[620px]",
              "text-[38px] font-semibold",
              "leading-[1.08]",
              "tracking-[-0.04em]",
              "sm:text-[50px]",
            ].join(" ")}
          >
            What are you putting off?
          </h1>

          <p
            className={[
              "mt-3 text-[16px]",
              "leading-7 text-[#71717a]",
            ].join(" ")}
          >
            Get it out of your head.
            Give it a time.
          </p>

          <form
            className="mt-8"
            onSubmit={handleSubmit}
          >
            <Input
              autoFocus
              value={task}
              placeholder="Reply to that email..."
              onChange={(event) =>
                setTask(
                  event.target.value,
                )
              }
              className="py-5 text-[17px]"
            />

            <div
              className={[
                "mt-4 flex flex-col",
                "gap-4 sm:flex-row",
                "sm:items-center",
                "sm:justify-between",
              ].join(" ")}
            >
              <Button
                type="submit"
                disabled={
                  !task.trim()
                }
                className="w-full px-7 sm:w-auto"
              >
                I'll do it later →
              </Button>

              <div
                className={[
                  "hidden items-center",
                  "gap-2 text-[12px]",
                  "text-[#a1a1aa]",
                  "sm:flex",
                ].join(" ")}
              >
                <kbd
                  className={[
                    "rounded border",
                    "border-[#e4e4e7]",
                    "bg-[#f4f4f5]",
                    "px-2 py-1",
                  ].join(" ")}
                >
                  Return
                </kbd>

                <span>
                  to continue
                </span>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AppShell>
  );
}