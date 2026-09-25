import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useSimulationStore } from "../store/useSimulationStore";

export function ShareModal() {
  const ref = useRef<HTMLDivElement>(null);

  const [working, setWorking] = useState(false);

  const panel = useSimulationStore(
    (state) => state.panel,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
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

  if (panel !== "share") return null;

  const naiveEstimate =
    population * Math.max(0, population - 1);

  const save = async () => {
    if (!ref.current) return;

    setWorking(true);

    try {
      const data = await toPng(ref.current, {
        pixelRatio: 2,
      });

      const link = document.createElement("a");

      link.download = "10000-danfos-result.png";
      link.href = data;
      link.click();
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-black/75 p-5 backdrop-blur-md">
      <div>
        <div
          ref={ref}
          className="aspect-square w-[min(82vw,520px)] bg-[#11120f] p-[8%] text-white"
        >
          <p className="text-[2.5%] font-bold tracking-[0.2em] text-white/35">
            DAY 26 / 30
          </p>

          <h2 className="mt-[3%] text-[12%] font-black leading-[0.75] tracking-[-0.07em] text-[#f1c40f]">
            10,000
            <br />
            DANFOS.
          </h2>

          <div className="mt-[10%] grid grid-cols-2 gap-[5%] border-y border-white/15 py-[6%]">
            <CardValue
              label="ACTIVE AGENTS"
              value={population.toLocaleString()}
            />

            <CardValue
              label="ENGINE"
              value={engine.toUpperCase()}
            />

            <CardValue
              label="FRAME"
              value={`${metrics.frameMs.toFixed(1)}ms`}
            />

            <CardValue
              label="CANDIDATE CHECKS"
              value={metrics.candidateChecks.toLocaleString()}
            />
          </div>

          <div className="mt-[7%]">
            <CardValue
              label="NAIVE PAIR-CHECK ESTIMATE"
              value={`≈ ${naiveEstimate.toLocaleString()}`}
            />
          </div>

          <p className="mt-[10%] text-[5.5%] font-black leading-[0.92] tracking-[-0.04em]">
            SAME TRAFFIC.
            <br />
            LESS SEARCHING.
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={save}
            className="bg-[#f1c40f] py-3 text-[9px] font-black tracking-[0.14em] text-black"
          >
            {working ? "RENDERING..." : "SAVE CARD"}
          </button>

          <button
            type="button"
            onClick={() => setPanel(null)}
            className="border border-white/15 py-3 text-[9px] font-bold tracking-[0.14em] text-white/55"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

function CardValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[7px] tracking-[0.16em] text-white/30">
        {label}
      </p>

      <p className="mt-1 font-mono text-[clamp(10px,2vw,16px)] font-semibold">
        {value}
      </p>
    </div>
  );
}
