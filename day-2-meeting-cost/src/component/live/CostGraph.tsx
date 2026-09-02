import { useMemo } from "react";

import { meetingCost } from "../../lib/calculations";
import type {
  Attendee,
  WorkSettings,
} from "../../types/meeting";

interface Props {
  attendees: Attendee[];
  elapsedMs: number;
  totalCost: number;
  settings: WorkSettings;
}

export function CostGraph({
  attendees,
  elapsedMs,
  totalCost,
  settings,
}: Props) {
  const path = useMemo(() => {
    if (elapsedMs < 100) return "";

    const samples = 30;
    const width = 1000;
    const height = 100;
    const maximum = Math.max(totalCost, 1);

    const points = Array.from(
      { length: samples },
      (_, index) => {
        const progress = index / (samples - 1);
        const sampleTime = elapsedMs * progress;

        const cost = meetingCost(
          attendees,
          sampleTime,
          settings,
        );

        const x = width * progress;
        const y =
          height -
          (cost / maximum) * (height - 5);

        return `${x},${y}`;
      },
    );

    return `M ${points.join(" L ")}`;
  }, [attendees, elapsedMs, settings, totalCost]);

  return (
    <div className="mt-8 h-28 w-full opacity-30">
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="size-full"
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}