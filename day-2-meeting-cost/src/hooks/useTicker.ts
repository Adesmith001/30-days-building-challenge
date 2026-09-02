/* eslint-disable react-hooks/purity */
import { useEffect, useState } from "react";

export function useTicker(
  enabled: boolean,
  frequencyMs = 80,
) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    let previous = 0;

    const tick = (timestamp: number) => {
      if (timestamp - previous >= frequencyMs) {
        previous = timestamp;
        setNow(Date.now());
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [enabled, frequencyMs]);

  return now;
}