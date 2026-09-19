export interface FrameStats {
  samples: number[];

  maxGapMs: number;

  estimatedMissedFrames:
    number;
}

export function waitForFrames(
  count = 1,
): Promise<void> {
  return new Promise(
    (resolve) => {
      let remaining = count;

      const tick = () => {
        remaining -= 1;

        if (
          remaining <= 0
        ) {
          resolve();
          return;
        }

        requestAnimationFrame(
          tick,
        );
      };

      requestAnimationFrame(
        tick,
      );
    },
  );
}

export async function estimateFrameInterval(
  sampleCount = 24,
) {
  const stamps: number[] = [];

  await new Promise<void>(
    (resolve) => {
      const sample = (
        now: number,
      ) => {
        stamps.push(now);

        if (
          stamps.length >=
          sampleCount + 1
        ) {
          resolve();
          return;
        }

        requestAnimationFrame(
          sample,
        );
      };

      requestAnimationFrame(
        sample,
      );
    },
  );

  const deltas =
    stamps
      .slice(1)
      .map(
        (
          time,
          index,
        ) =>
          time -
          stamps[index],
      );

  const sorted =
    [...deltas].sort(
      (a, b) => a - b,
    );

  return (
    sorted[
      Math.floor(
        sorted.length / 2,
      )
    ] || 16.67
  );
}

export function createFrameMonitor(
  targetFrameMs: number,
) {
  let running = false;

  let rafId = 0;

  let last = 0;

  const samples: number[] = [];

  const loop = (
    now: number,
  ) => {
    if (!running) {
      return;
    }

    if (last > 0) {
      samples.push(
        now - last,
      );
    }

    last = now;

    rafId =
      requestAnimationFrame(
        loop,
      );
  };

  return {
    start() {
      running = true;

      last = 0;

      rafId =
        requestAnimationFrame(
          loop,
        );
    },

    stop(): FrameStats {
      running = false;

      cancelAnimationFrame(
        rafId,
      );

      const maxGapMs =
        samples.length
          ? Math.max(
              ...samples,
            )
          : 0;

      const
        estimatedMissedFrames =
          samples.reduce(
            (
              total,
              delta,
            ) => {
              return (
                total +
                Math.max(
                  0,
                  Math.round(
                    delta /
                      targetFrameMs,
                  ) - 1,
                )
              );
            },
            0,
          );

      return {
        samples: [
          ...samples,
        ],

        maxGapMs,

        estimatedMissedFrames,
      };
    },
  };
}