import { useSimulationStore } from "../store/useSimulationStore";

export function Hud() {
  const photoMode = useSimulationStore(
    (state) => state.photoMode,
  );

  const population = useSimulationStore(
    (state) => state.population,
  );

  const engine = useSimulationStore(
    (state) => state.engine,
  );

  const metrics = useSimulationStore(
    (state) => state.metrics,
  );

  if (photoMode) return null;

  return (
    <div className="pointer-events-none absolute right-3 top-14 z-10 min-w-32 border border-white/10 bg-[#0c0d0c]/68 p-3 backdrop-blur-md md:right-5 md:min-w-40">
      <HudRow
        label="DANFOS"
        value={population.toLocaleString()}
      />

      <HudRow
        label="FPS"
        value={metrics.fps.toFixed(0)}
      />

      <HudRow
        label="FRAME"
        value={`${metrics.frameMs.toFixed(1)}ms`}
      />

      <HudRow
        label="ENGINE"
        value={engine.toUpperCase()}
      />
    </div>
  );
}

function HudRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/[0.07] py-1.5 last:border-b-0">
      <span className="text-[8px] font-semibold tracking-[0.16em] text-white/35">
        {label}
      </span>

      <span className="font-mono text-[10px] font-semibold text-white/85">
        {value}
      </span>
    </div>
  );
}
