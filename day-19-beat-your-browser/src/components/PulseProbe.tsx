import {
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  active: boolean;

  taps: number;

  onTap:
    () => void;
}

export function PulseProbe({
  active,
  taps,
  onTap,
}: Props) {
  const dotRef =
    useRef<HTMLDivElement>(
      null,
    );

  const counterRef =
    useRef<HTMLSpanElement>(
      null,
    );

  const positionRef =
    useRef(5);

  const [
    feedback,
    setFeedback,
  ] = useState(
    "TAP THE PULSE",
  );

  useEffect(
    () => {
      const reduced =
        window
          .matchMedia(
            "(prefers-reduced-motion: reduce)",
          )
          .matches;

      let rafId = 0;

      let frames = 0;

      const start =
        performance.now();

      const animate = (
        now: number,
      ) => {
        frames += 1;

        if (reduced) {
          if (
            counterRef.current
          ) {
            counterRef.current
              .textContent =
              `FRAME ${frames}`;
          }
        } else {
          const cycle =
            (
              (now - start) %
              2200
            ) / 2200;

          const travel =
            cycle < 0.5
              ? cycle * 2
              : (1 - cycle) *
                2;

          const position =
            5 +
            travel * 90;

          positionRef.current =
            position;

          if (
            dotRef.current
          ) {
            dotRef.current
              .style.left =
              `${position}%`;
          }
        }

        rafId =
          requestAnimationFrame(
            animate,
          );
      };

      rafId =
        requestAnimationFrame(
          animate,
        );

      return () =>
        cancelAnimationFrame(
          rafId,
        );
    },
    [],
  );

  const tap = () => {
    onTap();

    const hit =
      positionRef.current >=
        44 &&
      positionRef.current <=
        56;

    setFeedback(
      hit
        ? "TARGET HIT"
        : "INPUT RECEIVED",
    );

    window.setTimeout(
      () =>
        setFeedback(
          "TAP THE PULSE",
        ),
      500,
    );
  };

  return (
    <section
      className="
        border
        border-line
        bg-panel
        p-4
      "
    >
      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          font-mono
          text-[10px]
          text-muted
        "
      >
        <span>
          RESPONSIVENESS PROBE
        </span>

        <span
          className={
            active
              ? "text-lime"
              : "text-dim"
          }
        >
          {active
            ? "LIVE"
            : "STANDBY"}
        </span>
      </div>

      <button
        onPointerDown={
          tap
        }
        className="
          relative
          h-28
          w-full
          overflow-hidden
          border
          border-line
          bg-canvas
          text-left
        "
      >
        <div
          className="
            absolute
            inset-y-0
            left-[44%]
            w-[12%]
            border-x
            border-lime/50
            bg-lime/5
          "
        />

        <div
          className="
            absolute
            left-4
            right-4
            top-1/2
            h-px
            bg-line
          "
        />

        <div
          ref={dotRef}
          className="
            absolute
            left-[5%]
            top-1/2
            h-3
            w-3
            -translate-x-1/2
            -translate-y-1/2
            bg-lime
          "
        />

        <span
          ref={
            counterRef
          }
          className="
            absolute
            bottom-2
            left-3
            font-mono
            text-[9px]
            text-dim
          "
        />
      </button>

      <div
        className="
          mt-3
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <span
          className="
            font-mono
            text-[10px]
            text-muted
          "
        >
          {feedback}
        </span>

        <span
          className="
            font-mono
            text-[10px]
            text-lime
          "
        >
          {taps} TAPS REGISTERED
        </span>
      </div>
    </section>
  );
}