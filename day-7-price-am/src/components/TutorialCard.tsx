import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";

interface Props {
  onComplete: () => void;
}

export function TutorialCard({
  onComplete,
}: Props) {
  const x = useMotionValue(0);

  const rotate = useTransform(
    x,
    [-220, 220],
    [-5, 5],
  );

  const opacity = useTransform(
    x,
    [-160, -60, 0, 60, 160],
    [1, 0.2, 0, 0.2, 1],
  );

  async function commit(direction: number) {
    await animate(x, direction * 900, {
      duration: 0.36,
      ease: "easeIn",
    });

    onComplete();
  }

  function endDrag(
    _: unknown,
    info: {
      offset: { x: number };
      velocity: { x: number };
    },
  ) {
    const distance = Math.abs(info.offset.x);
    const velocity = Math.abs(info.velocity.x);

    if (distance < 110 && velocity < 700) {
      animate(x, 0, {
        type: "spring",
        stiffness: 420,
        damping: 28,
      });

      return;
    }

    const direction =
      Math.sign(info.offset.x || info.velocity.x) || 1;

    void commit(direction);
  }

  return (
    <motion.div
      drag="x"
      dragElastic={0.18}
      dragMomentum={false}
      onDragEnd={endDrag}
      style={{
        x,
        rotate,
        touchAction: "pan-y",
      }}
      className="
        relative rounded-2xl border
        border-[#aebeb1] bg-white p-5
        shadow-[0_20px_45px_rgba(21,31,23,0.12)]
      "
    >
      <motion.div
        style={{ opacity }}
        className="
          pointer-events-none absolute right-5 top-16
          z-30 rotate-6 border-2 border-[#a75b19]
          bg-white px-4 py-2 font-mono text-sm
          font-black tracking-[0.13em]
          text-[#99500b]
        "
      >
        DISMISS / SKIP
      </motion.div>

      <div
        className="
          flex justify-between border-b
          border-[#d7ddd7] pb-3 font-mono
          text-[10px] font-bold tracking-[0.13em]
        "
      >
        <span>TUTORIAL · REF #01-LAG-99</span>
        <span>☝ SWIPE DEMO</span>
      </div>

      <div
        className="
          mt-4 flex aspect-[4/3] items-center
          justify-center overflow-hidden rounded-xl
          border border-[#d2d6cf]
          bg-[#f3efe4]
        "
      >
        <div className="text-center">
          <div className="text-7xl">💧</div>

          <div
            className="
              mt-2 font-mono text-lg font-black
              text-[#256d9b]
            "
          >
            PURE WATER
          </div>

          <div className="font-mono text-xs">
            500ML
          </div>
        </div>
      </div>

      <h3 className="mt-5 text-3xl font-black">
        PURE WATER
      </h3>

      <p className="mt-1 font-mono text-xs text-[#95500f]">
        ONE SACHET · 50CL
      </p>

      <p className="mt-4 text-sm leading-6 text-[#5c655e]">
        Cards you don't know can be discarded without
        immediately revealing the answer.
      </p>

      <div
        className="
          mt-5 flex items-center justify-between
          rounded-xl border border-dashed
          border-[#c2cac2] px-4 py-4
          font-mono text-[10px] font-bold
          tracking-[0.12em]
        "
      >
        <span>←</span>
        <span>☝ DRAG HORIZONTALLY TO SKIP</span>
        <span>→</span>
      </div>
    </motion.div>
  );
}