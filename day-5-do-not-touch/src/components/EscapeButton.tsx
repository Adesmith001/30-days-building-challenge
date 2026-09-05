import { motion } from "motion/react";
import type { Point } from "../types/game";

interface Props {
  position: Point;
  width: number;
  scale: number;
  label: string;
  movement: "dodge" | "teleport";
  frozen: boolean;
  disabled: boolean;
  onAttempt: (pointerType: string) => void;
}

export function EscapeButton({
  position,
  width,
  scale,
  label,
  movement,
  frozen,
  disabled,
  onAttempt,
}: Props) {
  return (
    <motion.button
      type="button"
      data-game-button="true"
      disabled={disabled}
      initial={false}
      animate={{
        left: position.x,
        top: position.y,
        width,
        scale,
      }}
      transition={{
        duration: movement === "teleport" ? 0 : 0.16,
        ease: "easeOut",
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        onAttempt(event.pointerType);
      }}
      onClick={(event) => {
        if (event.detail === 0) {
          onAttempt("keyboard");
        }
      }}
      className="absolute z-20 min-h-11 -translate-x-1/2 -translate-y-1/2 bg-[#f04a2f] px-4 font-mono text-[14px] font-bold text-white disabled:cursor-default"
      style={{
        height: Math.max(44, 54 * scale),
        opacity: frozen ? 0.72 : 1,
      }}
    >
      {label}
    </motion.button>
  );
}