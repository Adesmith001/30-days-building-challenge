import { useEffect, useRef } from "react";
import { ChaosWorld } from "../chaosWorld";
import type { WorldApi, WorldOptions, WorldStats } from "../types";

export function ChaosCanvas({
  options,
  onReady,
  onStats,
}: {
  options: WorldOptions;
  onReady: (api: WorldApi) => void;
  onStats: (stats: WorldStats) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<ChaosWorld | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const world = new ChaosWorld(host, options, onStats);
    worldRef.current = world;
    onReady(world.api());
    return () => {
      world.destroy();
      worldRef.current = null;
    };
  }, [onReady, onStats]);

  useEffect(() => {
    worldRef.current?.setOptions(options);
  }, [options]);

  return <div ref={hostRef} className="canvas-host" aria-label="Cursor Chaos physics canvas" />;
}
