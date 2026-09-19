/* eslint-disable react-hooks/immutability */
interface Props {
  samples:
    number[];

  targetFrameMs:
    number;

  mode:
    | "main"
    | "worker";
}

export function FrameStrip({
  samples,
  targetFrameMs,
  mode,
}: Props) {
  const total =
    samples.reduce(
      (
        sum,
        sample,
      ) =>
        sum + sample,
      0,
    ) || 1;

  let elapsed = 0;

  const ticks =
    samples.map(
      (
        sample,
        index,
      ) => {
        elapsed += sample;

        return {
          index,

          left:
            (elapsed /
              total) *
            100,

          bad:
            sample >
            targetFrameMs *
              2.5,
        };
      },
    );

  return (
    <div
      className="
        border
        border-line
        bg-canvas
        p-3
      "
    >
      <div
        className="
          mb-3
          flex
          justify-between
          font-mono
          text-[9px]
          text-muted
        "
      >
        <span>
          {mode ===
          "main"
            ? "MAIN THREAD"
            : "WEB WORKER"}
        </span>

        <span>
          {
            samples.length
          }{" "}
          FRAME SAMPLES
        </span>
      </div>

      <div
        className="
          relative
          h-16
          overflow-hidden
          border-y
          border-line/70
        "
      >
        {ticks.map(
          (
            tick,
          ) => (
            <span
              key={
                tick.index
              }
              className={`
                absolute
                bottom-0
                top-0
                w-px
                ${
                  tick.bad
                    ? "bg-danger"
                    : mode ===
                        "main"
                      ? "bg-amber"
                      : "bg-cyan"
                }
              `}
              style={{
                left:
                  `${tick.left}%`,
              }}
            />
          ),
        )}
      </div>
    </div>
  );
}