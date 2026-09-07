import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useState } from "react";
import type {
  GuessDirection,
  PriceItem,
} from "../types/game";

interface Props {
  item: PriceItem;
  exitDirection?: GuessDirection;
  canSkip: boolean;
  disabled?: boolean;
  onSkip: () => void;
  onNoSkips: () => void;
  onAutoComplete: () => void;
}

export function PriceCard({
  item,
  exitDirection,
  canSkip,
  disabled = false,
  onSkip,
  onNoSkips,
  onAutoComplete,
}: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-5, 5]);
  const skipOpacity = useTransform(
    x,
    [-150, -50, 0, 50, 150],
    [1, 0.2, 0, 0.2, 1],
  );

  const [committed, setCommitted] = useState(false);

  async function finishManualSkip(direction: number) {
    setCommitted(true);

    await animate(x, direction * 900, {
      duration: 0.32,
      ease: "easeIn",
    });

    onSkip();
  }

  function handleDragEnd(
    _: unknown,
    info: {
      offset: { x: number };
      velocity: { x: number };
    },
  ) {
    const passedDistance =
      Math.abs(info.offset.x) >= 120;

    const passedVelocity =
      Math.abs(info.velocity.x) >= 750;

    if (!passedDistance && !passedVelocity) {
      animate(x, 0, {
        type: "spring",
        stiffness: 420,
        damping: 30,
      });

      return;
    }

    if (!canSkip) {
      onNoSkips();

      animate(x, 0, {
        type: "spring",
        stiffness: 430,
        damping: 28,
      });

      return;
    }

    const direction =
      info.offset.x === 0
        ? Math.sign(info.velocity.x)
        : Math.sign(info.offset.x);

    void finishManualSkip(direction || 1);
  }

  const autoX =
    exitDirection === "low"
      ? -900
      : exitDirection === "high" ||
          exitDirection === "exact"
        ? 900
        : 0;

  const exact = exitDirection === "exact";

  return (
    <motion.article
      drag={
        !disabled && !exitDirection && !committed
          ? "x"
          : false
      }
      dragElastic={0.16}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection
          ? exact
            ? {
                x: [0, 0, autoX],
                scale: [1, 1.035, 1],
                rotate: [0, 0, 4],
              }
            : {
                x: autoX,
                rotate:
                  exitDirection === "low" ? -5 : 5,
              }
          : undefined
      }
      transition={
        exact
          ? {
              duration: 0.78,
              times: [0, 0.42, 1],
            }
          : {
              duration: 0.48,
              ease: [0.42, 0, 0.58, 1],
            }
      }
      onAnimationComplete={() => {
        if (exitDirection) {
          onAutoComplete();
        }
      }}
      style={{
        x,
        rotate,
        touchAction: "pan-y",
      }}
      className="
        relative z-20 rounded-2xl border
        border-[#aebeb1] bg-[#fffefa] p-4
        shadow-[0_20px_45px_rgba(24,32,25,0.12)]
        sm:p-5
      "
    >
      <motion.div
        style={{ opacity: skipOpacity }}
        className="
          pointer-events-none absolute left-1/2
          top-[38%] z-30 -translate-x-1/2
          -rotate-3 border-2 border-[#ad361f]
          bg-[#fff7f2]/95 px-7 py-3
          font-mono text-3xl font-black
          tracking-[0.12em] text-[#ad361f]
        "
      >
        SKIP
      </motion.div>

      {exitDirection && (
        <div
          className="
            absolute left-1/2 top-[38%] z-40
            -translate-x-1/2 -rotate-2
            border-2 border-[#a93420]
            bg-[#fff8f3] px-6 py-3
            font-mono text-xl font-black
            tracking-[0.12em] text-[#a93420]
          "
        >
          {exact
            ? "EXACT."
            : exitDirection === "low"
              ? "TOO LOW"
              : "TOO HIGH"}
        </div>
      )}

      <div
        className="
          flex items-center justify-between border-b
          border-[#d7dcd5] pb-3 font-mono
          text-[10px] font-bold tracking-[0.13em]
          text-[#6d766e] sm:text-xs
        "
      >
        <span>
          ● {item.category} · {item.difficulty}
        </span>

        <span>{item.location}</span>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl">
        <img
          src={item.image}
          alt={item.name}
          draggable={false}
          className="
            aspect-[4/3] w-full object-cover
            select-none
          "
        />

        <div
          className="
            absolute bottom-3 left-3 rounded
            bg-[#282825]/90 px-3 py-1.5
            font-mono text-[10px] font-bold
            tracking-[0.13em] text-white
          "
        >
          VERIFIED ARCHIVE
        </div>
      </div>

      <div className="pt-5">
        <h2
          className="
            text-[26px] font-black leading-none
            tracking-[-0.04em] sm:text-[30px]
          "
        >
          {item.name}
        </h2>

        <p className="mt-2 text-sm text-[#5f665f]">
          {item.context}
        </p>

        <div
          className="
            mt-5 flex items-center justify-between
            border-t border-dashed border-[#ced4cd]
            pt-4
          "
        >
          <span
            className="
              font-mono text-[10px] font-bold
              tracking-[0.13em] text-[#747d75]
            "
          >
            MARKET VALUE
          </span>

          <span
            className="
              font-mono text-lg font-black
              tracking-[0.05em] text-[#075d38]
            "
          >
            HOW MUCH?
          </span>
        </div>
      </div>
    </motion.article>
  );
}