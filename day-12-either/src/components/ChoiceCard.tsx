import {
  Check,
} from "lucide-react";

import {
  motion,
} from "motion/react";

type ChoiceCardProps = {
  side: "A" | "B";
  title: string;
  selected?: boolean;
  dimmed?: boolean;
  disabled?: boolean;
  helper?: string;
  shortcut?: string;
  onClick: () => void;
};

export function ChoiceCard({
  side,
  title,
  selected = false,
  dimmed = false,
  disabled = false,
  helper = "Tap to choose",
  shortcut,
  onClick,
}: ChoiceCardProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      animate={{
        scale: selected ? 1.018 : 1,
        opacity: dimmed ? 0.34 : 1,
      }}
      whileHover={
        disabled
          ? undefined
          : {
              scale: selected
                ? 1.018
                : 1.008,
            }
      }
      whileTap={
        disabled
          ? undefined
          : {
              scale: 0.985,
            }
      }
      transition={{
        duration: 0.16,
      }}
      className={`
        flex min-h-[190px]
        w-full flex-col
        justify-between rounded-2xl
        border p-6 text-left
        outline-none
        transition-colors
        md:min-h-[235px]
        md:p-8
        ${
          selected
            ? "border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]"
            : "border-[#e7e7e7] bg-white text-[#111111] hover:border-[#111111] dark:border-[#292929] dark:bg-[#121212] dark:text-[#f5f5f5] dark:hover:border-[#f5f5f5]"
        }
      `}
    >
      <div className="flex items-start justify-between">
        <span
          className={`
            text-[10px] font-semibold
            uppercase tracking-[0.14em]
            ${
              selected
                ? "text-[#bdbdbd] dark:text-[#555]"
                : "text-[#8a8a8a]"
            }
          `}
        >
          Option {side}
        </span>

        <span
          className={`
            flex size-[18px]
            items-center justify-center
            rounded-full border
            ${
              selected
                ? "border-white dark:border-[#111111]"
                : "border-[#d5d5d5] dark:border-[#444]"
            }
          `}
        >
          {selected && (
            <Check
              size={11}
              strokeWidth={3}
            />
          )}
        </span>
      </div>

      <div className="py-5">
        <h2
          className="
            text-[28px] font-semibold
            leading-[1.05]
            tracking-[-0.04em]
            md:text-[36px]
          "
        >
          {title}
        </h2>
      </div>

      <div
        className={`
          flex items-center
          justify-between gap-3
          text-[11px]
          ${
            selected
              ? "text-[#bdbdbd] dark:text-[#555]"
              : "text-[#8a8a8a]"
          }
        `}
      >
        <span>{helper}</span>

        {shortcut && (
          <span
            className={`
              rounded px-1.5 py-0.5
              text-[9px] font-semibold
              ${
                selected
                  ? "bg-white/10 dark:bg-black/10"
                  : "bg-[#f3f3f3] dark:bg-[#202020]"
              }
            `}
          >
            {shortcut}
          </span>
        )}
      </div>
    </motion.button>
  );
}