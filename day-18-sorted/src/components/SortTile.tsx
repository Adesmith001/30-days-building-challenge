import {
  motion,
} from "motion/react";

import type {
  SortItem,
} from "../types/game";

interface Props {
  item: SortItem;
  index: number;
  selectedPosition?: number;
  disabled?: boolean;
  onSelect: () => void;
}

export function SortTile({
  item,
  index,
  selectedPosition,
  disabled,
  onSelect,
}: Props) {
  const selected =
    selectedPosition !==
    undefined;

  return (
    <motion.button
      layoutId={
        `tile-${item.id}`
      }
      whileTap={
        !disabled
          ? {
              scale: 0.97,
            }
          : undefined
      }
      onClick={onSelect}
      disabled={disabled}
      aria-label={
        `${
          item.label
        }, ${
          selected
            ? `position ${
                selectedPosition +
                1
              }`
            : "not selected"
        }`
      }
      className={`
        tactile-tile
        relative
        aspect-square
        overflow-hidden
        rounded-2xl
        border
        bg-white
        text-left
        text-ink
        transition
        ${
          selected
            ? `
              border-gold
              opacity-45
            `
            : `
              border-slate-200
              hover:-translate-y-0.5
            `
        }
        disabled:cursor-default
      `}
    >
      {item.image ? (
        <>
          <img
            src={item.image}
            alt=""
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/90
              via-black/25
              to-black/5
            "
          />

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              p-3
              text-white
            "
          >
            <span
              className="
                mb-1
                block
                font-display
                text-[10px]
                font-bold
                text-white/60
              "
            >
              {index + 1}
            </span>

            <span
              className="
                block
                font-display
                text-base
                font-bold
                leading-tight
              "
            >
              {item.label}
            </span>
          </div>
        </>
      ) : (
        <div
          className="
            flex
            h-full
            flex-col
            justify-between
            p-4
          "
        >
          <span
            className="
              font-display
              text-xs
              font-bold
              text-slate-400
            "
          >
            {index + 1}
          </span>

          <span
            className="
              font-display
              text-lg
              font-bold
              leading-tight
              sm:text-xl
            "
          >
            {item.label}
          </span>
        </div>
      )}

      {selected && (
        <span
          className="
            absolute
            right-2
            top-2
            rounded-full
            bg-gold
            px-2
            py-1
            font-display
            text-[10px]
            font-bold
            text-ink
          "
        >
          #
          {selectedPosition! + 1}
        </span>
      )}
    </motion.button>
  );
}