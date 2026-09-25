import { X } from "lucide-react";
import { useSimulationStore } from "../store/useSimulationStore";

export function EnginePanel() {
  const panel = useSimulationStore(
    (state) => state.panel,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
  );

  const engine = useSimulationStore(
    (state) => state.engine,
  );

  const population = useSimulationStore(
    (state) => state.population,
  );

  const metrics = useSimulationStore(
    (state) => state.metrics,
  );

  const inspector = useSimulationStore(
    (state) => state.inspector,
  );

  const requestEngine = useSimulationStore(
    (state) => state.requestEngine,
  );

  const toggleOverlay = useSimulationStore(
    (state) => state.toggleOverlay,
  );

  const showGrid = useSimulationStore(
    (state) => state.showGrid,
  );

  const showNeighbours = useSimulationStore(
    (state) => state.showNeighbours,
  );

  const runBenchmark = useSimulationStore(
    (state) => state.runBenchmark,
  );

  if (panel !== "engine") return null;

  return (
    <PanelShell
      title="ENGINE"
      onClose={() => setPanel(null)}
    >
      <div className="grid grid-cols-3 border border-white/10">
        {(["grid", "naive", "quadtree"] as const).map(
          (mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => requestEngine(mode)}
              className={`px-2 py-3 text-[9px] font-black tracking-[0.14em] ${
                engine === mode
                  ? "bg-[#f1c40f] text-black"
                  : "text-white/40 hover:bg-white/5"
              }`}
            >
              {mode.toUpperCase()}
            </button>
          ),
        )}
      </div>

      <div className="mt-5 divide-y divide-white/[0.08]">
        <Metric
          label="DANFOS"
          value={population.toLocaleString()}
        />

        <Metric
          label="FRAME"
          value={`${metrics.frameMs.toFixed(2)}ms`}
        />

        <Metric
          label="SIMULATION"
          value={`${metrics.simulationMs.toFixed(2)}ms`}
        />

        <Metric
          label="CANDIDATE CHECKS"
          value={metrics.candidateChecks.toLocaleString()}
        />

        <Metric
          label="AVG NEIGHBOURS"
          value={metrics.avgNeighbours.toFixed(1)}
        />

        <Metric
          label="OCCUPIED CELLS"
          value={
            engine === "grid"
              ? metrics.occupiedCells.toLocaleString()
              : "—"
          }
        />
      </div>

      {inspector && (
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-[9px] font-black tracking-[0.18em] text-[#f1c40f]">
            DANFO #{inspector.id}
          </p>

          <div className="mt-3 divide-y divide-white/[0.07]">
            <Metric
              label="SPEED"
              value={`${inspector.speedKmh.toFixed(0)} KM/H*`}
            />

            <Metric
              label="ROUTE"
              value={inspector.route}
            />

            <Metric
              label="CANDIDATES"
              value={inspector.candidates.toLocaleString()}
            />

            <Metric
              label="NEIGHBOURS"
              value={inspector.neighbours.toString()}
            />

            <Metric
              label="CELL"
              value={`${inspector.cellX}, ${inspector.cellZ}`}
            />
          </div>

          <p className="mt-3 text-[8px] leading-4 text-white/25">
            *Simulated value. Not live Lagos traffic data.
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Action
          active={showGrid}
          onClick={() => toggleOverlay("grid")}
        >
          SHOW GRID
        </Action>

        <Action
          active={showNeighbours}
          onClick={() =>
            toggleOverlay("neighbours")
          }
        >
          NEIGHBOURS
        </Action>

        <Action onClick={() => setPanel("lab")}>
          ENGINE LAB
        </Action>

        <Action onClick={runBenchmark}>
          BENCHMARK
        </Action>
      </div>
    </PanelShell>
  );
}

export function PanelShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <aside className="absolute inset-x-3 bottom-20 z-30 max-h-[70vh] overflow-y-auto border border-white/10 bg-[#0a0b0a]/92 p-5 backdrop-blur-xl md:inset-x-auto md:bottom-auto md:right-5 md:top-14 md:w-[330px]">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[10px] font-black tracking-[0.22em] text-white/65">
          {title}
        </span>

        <button
          type="button"
          onClick={onClose}
          className="text-white/35 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {children}
    </aside>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 py-2">
      <span className="text-[8px] font-semibold tracking-[0.14em] text-white/30">
        {label}
      </span>

      <span className="max-w-[60%] text-right font-mono text-[10px] font-semibold text-white/80">
        {value}
      </span>
    </div>
  );
}

function Action({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-3 text-[8px] font-bold tracking-[0.13em] ${
        active
          ? "border-[#f1c40f] bg-[#f1c40f]/10 text-[#f1c40f]"
          : "border-white/10 text-white/45 hover:border-white/30 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
