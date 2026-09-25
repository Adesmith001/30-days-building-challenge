import { useMemo } from "react";
import { useSimulationStore } from "../store/useSimulationStore";
import { PanelShell } from "./EnginePanel";

export function BenchmarkPanel() {
  const panel = useSimulationStore(
    (state) => state.panel,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
  );

  const benchmark = useSimulationStore(
    (state) => state.benchmark,
  );

  const runBenchmark = useSimulationStore(
    (state) => state.runBenchmark,
  );

  if (panel !== "benchmark") return null;

  return (
    <PanelShell
      title="THIS BROWSER'S RUN"
      onClose={() => setPanel(null)}
    >
      {benchmark.running ? (
        <div className="py-10">
          <p className="text-[9px] tracking-[0.16em] text-white/35">
            CURRENT
          </p>

          <div className="mt-2 text-3xl font-black uppercase tracking-[-0.04em]">
            {benchmark.currentEngine}
          </div>

          <div className="mt-1 text-lg font-semibold text-[#f1c40f]">
            {benchmark.currentPopulation?.toLocaleString()}{" "}
            DANFOS
          </div>

          <p className="mt-6 font-mono text-xs text-white/40">
            RUN {benchmark.run ?? 0} /{" "}
            {benchmark.totalRuns ?? 0}
          </p>

          <div className="mt-5 h-1 overflow-hidden bg-white/10">
            <div className="h-full w-1/3 animate-[pulse_1s_infinite] bg-[#f1c40f]" />
          </div>
        </div>
      ) : benchmark.results.length ? (
        <>
          <BenchmarkChart />

          <div className="mt-6 space-y-1">
            {benchmark.results.map(
              (result, index) => (
                <div
                  key={`${result.engine}-${result.population}-${index}`}
                  className="grid grid-cols-[52px_1fr_70px] border-b border-white/[0.06] py-2 font-mono text-[8px]"
                >
                  <span className="text-white/35">
                    {result.population >= 1000
                      ? `${result.population / 1000}K`
                      : result.population}
                  </span>

                  <span className="uppercase text-white/55">
                    {result.engine}
                  </span>

                  <span className="text-right text-white/75">
                    {result.skipped
                      ? "SKIPPED"
                      : `${result.simulationMs.toFixed(2)}ms`}
                  </span>
                </div>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={runBenchmark}
            className="mt-5 w-full border border-white/10 py-3 text-[8px] font-bold tracking-[0.14em] text-white/50 hover:text-white"
          >
            RUN AGAIN
          </button>
        </>
      ) : (
        <div className="py-6">
          <h3 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
            Run the
            <br />
            engines.
          </h3>

          <p className="mt-4 text-xs leading-5 text-white/40">
            500 · 1K · 2.5K · 5K · 10K.
            Unsafe naive loads are skipped
            automatically.
          </p>

          <button
            type="button"
            onClick={runBenchmark}
            className="mt-6 bg-[#f1c40f] px-5 py-3 text-[9px] font-black tracking-[0.14em] text-black"
          >
            RUN BENCHMARK →
          </button>
        </div>
      )}
    </PanelShell>
  );
}

function BenchmarkChart() {
  const results = useSimulationStore(
    (state) => state.benchmark.results,
  );

  const lines = useMemo(() => {
    const available = results.filter(
      (result) => !result.skipped,
    );

    const maxTime = Math.max(
      1,
      ...available.map(
        (result) => result.simulationMs,
      ),
    );

    const make = (engine: "grid" | "naive") =>
      results
        .filter(
          (result) =>
            result.engine === engine &&
            !result.skipped,
        )
        .map((result, index, all) => {
          const x =
            all.length === 1
              ? 50
              : (index / (all.length - 1)) * 280 +
                10;

          const y =
            105 -
            (result.simulationMs / maxTime) * 90;

          return `${x},${y}`;
        })
        .join(" ");

    return {
      grid: make("grid"),
      naive: make("naive"),
    };
  }, [results]);

  return (
    <div className="border border-white/10 p-3">
      <svg
        viewBox="0 0 300 120"
        className="h-36 w-full"
      >
        {[20, 50, 80, 110].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="300"
            y2={y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        <polyline
          points={lines.grid}
          fill="none"
          stroke="#f1c40f"
          strokeWidth="2"
        />

        <polyline
          points={lines.naive}
          fill="none"
          stroke="#e3e1d5"
          strokeWidth="2"
        />
      </svg>

      <div className="flex gap-5 text-[8px] tracking-[0.14em] text-white/40">
        <span>YELLOW · GRID</span>
        <span>WHITE · NAIVE</span>
      </div>
    </div>
  );
}
