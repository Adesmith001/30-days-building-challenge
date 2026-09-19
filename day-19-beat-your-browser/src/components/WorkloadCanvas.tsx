import {
  useEffect,
  useRef,
} from "react";

import type {
  TaskOutput,
} from "../types/benchmark";

interface Props {
  output?:
    TaskOutput;

  compact?:
    boolean;
}

export function WorkloadCanvas({
  output,
  compact = false,
}: Props) {
  const canvasRef =
    useRef<HTMLCanvasElement>(
      null,
    );

  useEffect(
    () => {
      if (
        !output ||
        output.task ===
          "primes" ||
        !canvasRef.current
      ) {
        return;
      }

      const canvas =
        canvasRef.current;

      canvas.width =
        output.width;

      canvas.height =
        output.height;

      const context =
        canvas.getContext(
          "2d",
        );

      if (!context) {
        return;
      }

      const pixels =
        new Uint8ClampedArray(
          output.buffer,
        );

      context.putImageData(
        new ImageData(
          pixels,
          output.width,
          output.height,
        ),
        0,
        0,
      );
    },
    [output],
  );

  if (!output) {
    return (
      <div
        className="
          grid
          min-h-48
          place-items-center
          border
          border-line
          bg-canvas
          font-mono
          text-[10px]
          text-dim
        "
      >
        OUTPUT WAITING
      </div>
    );
  }

  if (
    output.task ===
    "primes"
  ) {
    return (
      <div
        className="
          grid
          min-h-48
          place-items-center
          border
          border-line
          bg-canvas
          p-6
          text-center
        "
      >
        <div>
          <div
            className="
              metric
              font-mono
              text-4xl
              text-lime
            "
          >
            {output.count
              .toLocaleString()}
          </div>

          <div
            className="
              mt-2
              font-mono
              text-[10px]
              tracking-[.12em]
              text-muted
            "
          >
            PRIMES FOUND
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        overflow-hidden
        border
        border-line
        bg-canvas
        ${
          compact
            ? "p-2"
            : "p-3"
        }
      `}
    >
      <canvas
        ref={
          canvasRef
        }
        className="
          aspect-[3/2]
          h-auto
          w-full
          object-contain
        "
      />
    </div>
  );
}