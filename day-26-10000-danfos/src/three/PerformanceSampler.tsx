import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSimulationStore } from "../store/useSimulationStore";

export function PerformanceSampler() {
  const accumulator = useRef(0);
  const frames = useRef(0);
  const total = useRef(0);

  useFrame((_, delta) => {
    accumulator.current += delta;
    total.current += delta;
    frames.current += 1;

    if (accumulator.current < 0.25) return;

    const seconds = total.current;
    const count = frames.current;

    const frameMs =
      count > 0 ? (seconds / count) * 1000 : 0;

    const fps =
      seconds > 0 ? count / seconds : 0;

    useSimulationStore
      .getState()
      .mergeMetrics({
        fps,
        frameMs,
      });

    accumulator.current = 0;
    total.current = 0;
    frames.current = 0;
  });

  return null;
}
