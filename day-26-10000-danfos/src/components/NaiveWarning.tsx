import { useSimulationStore } from "../store/useSimulationStore";

export function NaiveWarning() {
  const panel = useSimulationStore(
    (state) => state.panel,
  );

  const population = useSimulationStore(
    (state) => state.population,
  );

  const calibration = useSimulationStore(
    (state) => state.calibration,
  );

  const confirmNaive = useSimulationStore(
    (state) => state.confirmNaive,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
  );

  if (panel !== "naive-warning") return null;

  const pairs =
    population * Math.max(0, population - 1);

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-black/60 px-5 backdrop-blur-md">
      <div className="w-full max-w-lg border border-white/15 bg-[#0d0e0c] p-7">
        <p className="text-[9px] font-bold tracking-[0.18em] text-white/35">
          NAIVE ENGINE
        </p>

        <h2 className="mt-3 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
          That would be
          <br />
          a lot of searching.
        </h2>

        <div className="mt-7 border-y border-white/10 py-5">
          <div className="text-3xl font-black text-[#f1c40f]">
            {population.toLocaleString()}
          </div>

          <div className="mt-1 text-[9px] tracking-[0.15em] text-white/35">
            DANFOS
          </div>

          <div className="mt-5 font-mono text-lg">
            ≈ {pairs.toLocaleString()}
          </div>

          <div className="mt-1 text-[9px] tracking-[0.15em] text-white/35">
            PAIR CHECKS / UPDATE
          </div>
        </div>

        <p className="mt-5 text-xs leading-5 text-white/40">
          This browser's measured safe naive limit is{" "}
          <strong className="text-white/80">
            {calibration?.naiveSafeLimit.toLocaleString() ??
              "2,500"}
          </strong>
          . GRID can continue beyond it.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={confirmNaive}
            className="bg-[#f1c40f] px-3 py-3 text-[8px] font-black tracking-[0.12em] text-black"
          >
            RUN SAFE NAIVE
          </button>

          <button
            type="button"
            onClick={() => setPanel("engine")}
            className="border border-white/10 px-3 py-3 text-[8px] font-black tracking-[0.12em] text-white/50"
          >
            KEEP GRID
          </button>
        </div>
      </div>
    </div>
  );
}
