import { motion } from "motion/react";
import type { Point } from "../types/game";

interface Props {
  position: Point;
  width: number;
  scale: number;
  label: string;
  onMiss: () => void;
}

export function DecoyButton({
  position,
  width,
  scale,
  label,
  onMiss,
}: Props) {
  return (
    <motion.button
      type="button"
      data-game-button="true"
      data-decoy="true"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        left: position.x,
        top: position.y,
        width,
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        onMiss();
      }}
      onClick={(event) => {
        if (event.detail === 0) {
          onMiss();
        }
      }}
      className="absolute z-10 min-h-11 -translate-x-1/2 -translate-y-1/2 bg-[#1248ff] px-4 font-mono text-[14px] font-bold text-white transition-colors hover:bg-[#0d39d4]"
      style={{
        height: Math.max(44, 54 * scale),
      }}
    >
      {label}
    </motion.button>
  );
}