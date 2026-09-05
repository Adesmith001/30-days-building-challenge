import { useEffect, useRef } from "react";
import { awayPoint, distance, randomPoint } from "../lib/geometry";
import type { LevelConfig, Point, PointerSnapshot } from "../types/game";

interface Props {
  active: boolean;
  frozen: boolean;
  level: LevelConfig;
  pointer: PointerSnapshot;
  position: Point;
  bounds: Point;
  buttonWidth: number;
  onMove: (position: Point, mode: "dodge" | "teleport") => void;
  onEvade: () => void;
}

export function useEscapeBehavior({
  active,
  frozen,
  level,
  pointer,
  position,
  bounds,
  buttonWidth,
  onMove,
  onEvade,
}: Props) {
  const lastEscape = useRef(0);

  useEffect(() => {
    if (
      !active ||
      frozen ||
      !pointer.inside ||
      level.dangerRadius <= 0 ||
      distance(pointer, position) > level.dangerRadius
    ) {
      return;
    }

    if (performance.now() - lastEscape.current < level.cooldownMs) {
      return;
    }

    if (
      level.mechanics.includes("slow") &&
      pointer.speed < 0.35
    ) {
      return;
    }

    lastEscape.current = performance.now();
    onEvade();

    const mode = level.mechanics.includes("teleport")
      ? "teleport"
      : "dodge";
    const nextPosition =
      mode === "teleport"
        ? randomPoint(bounds, buttonWidth)
        : awayPoint(
            position,
            pointer,
            level.moveDistance,
            bounds,
            buttonWidth,
          );

    onMove(nextPosition, mode);
  }, [
    active,
    bounds,
    buttonWidth,
    frozen,
    level,
    onEvade,
    onMove,
    pointer,
    position,
  ]);
}