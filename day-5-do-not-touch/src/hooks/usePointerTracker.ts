/* eslint-disable react-hooks/purity */
import { useCallback, useRef, useState } from "react";
import type { PointerSnapshot } from "../types/game";

const initialPointer: PointerSnapshot = {
  x: 0,
  y: 0,
  previousX: 0,
  previousY: 0,
  velocityX: 0,
  velocityY: 0,
  speed: 0,
  acceleration: 0,
  pointerType: "mouse",
  inside: false,
};

export function usePointerTracker() {
  const [pointer, setPointer] =
    useState<PointerSnapshot>(initialPointer);

  const previous = useRef({
    x: 0,
    y: 0,
    time: performance.now(),
    speed: 0,
  });

  const trackPointer = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const now = performance.now();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const deltaTime = Math.max(1, now - previous.current.time);

      const velocityX =
        (x - previous.current.x) / deltaTime;

      const velocityY =
        (y - previous.current.y) / deltaTime;

      const speed = Math.hypot(velocityX, velocityY);

      const acceleration =
        (speed - previous.current.speed) / deltaTime;

      setPointer({
        x,
        y,
        previousX: previous.current.x,
        previousY: previous.current.y,
        velocityX,
        velocityY,
        speed,
        acceleration,
        pointerType: event.pointerType,
        inside: true,
      });

      previous.current = {
        x,
        y,
        time: now,
        speed,
      };
    },
    [],
  );

  const leavePointer = useCallback(() => {
    setPointer((current) => ({
      ...current,
      inside: false,
    }));
  }, []);

  return {
    pointer,
    trackPointer,
    leavePointer,
  };
}