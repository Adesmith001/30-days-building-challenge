interface Props {
  level: number;
  score: number;
  streak: number;
}

export function GameHUD({
  level,
  score,
  streak,
}: Props) {
  return (
    <section className="mx-auto grid w-full max-w-[1040px] grid-cols-3 border-b border-[#cfd3df] px-1 py-7">
      <div>
        <div className="font-mono text-[10px] tracking-[0.14em] text-[#646a7d]">
          CURRENT LEVEL
        </div>

        <div className="mt-1 font-mono text-[25px] font-bold">
          {String(level).padStart(2, "0")}{" "}
          <span className="text-[12px] text-[#8c91a2]">
            / 10
          </span>
        </div>
      </div>

      <div className="text-center">
        <div className="font-mono text-[10px] tracking-[0.14em] text-[#646a7d]">
          SCORE
        </div>

        <div className="mt-1 font-mono text-[26px] font-bold">
          {score.toLocaleString()}
        </div>
      </div>

      <div className="text-right">
        <div className="font-mono text-[10px] tracking-[0.14em] text-[#646a7d]">
          MOMENTUM
        </div>

        <div className="mt-1 font-mono text-[24px] font-bold text-[#1248ff]">
          STREAK ×{streak}
        </div>
      </div>
    </section>
  );
}