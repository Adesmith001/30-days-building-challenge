import { useState } from "react";
import { runWebGpuProbe } from "../gpu/webgpu-probe";
import { useSimulationStore } from "../store/useSimulationStore";
import { PanelShell } from "./EnginePanel";

export function EngineLab() {
  const panel = useSimulationStore(
    (state) => state.panel,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
  );

  const params = useSimulationStore(
    (state) => state.params,
  );

  const setParam = useSimulationStore(
    (state) => state.setParam,
  );

  const resetParams = useSimulationStore(
    (state) => state.resetParams,
  );

  const [gpuResult, setGpuResult] =
    useState<string>("NOT RUN");

  if (panel !== "lab") return null;

  return (
    <PanelShell
      title="ENGINE LAB"
      onClose={() => setPanel(null)}
    >
      <Control
        label="NEIGHBOUR RADIUS"
        value={params.neighbourRadius}
        min={8}
        max={50}
        step={1}
        onChange={(value) =>
          setParam("neighbourRadius", value)
        }
      />

      <Control
        label="GRID CELL SIZE"
        value={params.cellSize}
        min={8}
        max={80}
        step={1}
        onChange={(value) =>
          setParam("cellSize", value)
        }
      />

      <Control
        label="MAX SPEED"
        value={params.maxSpeed}
        min={4}
        max={22}
        step={0.5}
        onChange={(value) =>
          setParam("maxSpeed", value)
        }
      />

      <Control
        label="SEPARATION"
        value={params.separation}
        min={0}
        max={5}
        step={0.1}
        onChange={(value) =>
          setParam("separation", value)
        }
      />

      <Control
        label="ALIGNMENT"
        value={params.alignment}
        min={0}
        max={3}
        step={0.1}
        onChange={(value) =>
          setParam("alignment", value)
        }
      />

      <Control
        label="ROAD FORCE"
        value={params.roadForce}
        min={0.5}
        max={6}
        step={0.1}
        onChange={(value) =>
          setParam("roadForce", value)
        }
      />

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black tracking-[0.16em]">
              WEBGPU COMPUTE PROBE
            </p>

            <p className="mt-1 text-[8px] text-white/30">
              10K agents · 120 compute dispatches
            </p>
          </div>

          <span className="font-mono text-[9px] text-[#f1c40f]">
            {gpuResult}
          </span>
        </div>

        <button
          type="button"
          onClick={async () => {
            setGpuResult("RUNNING");

            try {
              const result =
                await runWebGpuProbe();

              setGpuResult(
                `${result.averageDispatchMs.toFixed(3)}ms`,
              );
            } catch {
              setGpuResult("UNAVAILABLE");
            }
          }}
          className="mt-3 w-full border border-white/10 py-3 text-[8px] font-bold tracking-[0.14em] text-white/50 hover:text-white"
        >
          RUN GPU PROBE
        </button>
      </div>

      <button
        type="button"
        onClick={resetParams}
        className="mt-3 w-full bg-white/8 py-3 text-[8px] font-bold tracking-[0.14em] text-white/55"
      >
        RESET DEFAULTS
      </button>
    </PanelShell>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block border-b border-white/[0.07] py-3">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-semibold tracking-[0.14em] text-white/35">
          {label}
        </span>

        <span className="font-mono text-[10px] text-white/75">
          {value.toFixed(
            Number.isInteger(step) ? 0 : 1,
          )}
        </span>
      </div>

      <input
        className="mt-3 w-full accent-[#f1c40f]"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
      />
    </label>
  );
}
