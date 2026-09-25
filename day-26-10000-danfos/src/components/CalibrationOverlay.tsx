import { ArrowRight } from "lucide-react";
import { useSimulationStore } from "../store/useSimulationStore";

export function CalibrationOverlay() {
  const screen = useSimulationStore(
    (state) => state.screen,
  );

  const calibration = useSimulationStore(
    (state) => state.calibration,
  );

  const enterCity = useSimulationStore(
    (state) => state.enterCity,
  );

  if (screen === "calibrating") {
    return (
      <div className="absolute inset-0 z-40 grid place-items-center bg-[#0d0f0e]/90 backdrop-blur-sm">
        <div className="max-w-xl px-7">
          <div className="mb-8 flex h-12 items-end gap-1">
            {Array.from({ length: 18 }).map(
              (_, index) => (
                <span
                  key={index}
                  className="w-1.5 animate-pulse bg-[#f1c40f]"
                  style={{
                    height: `${12 + ((index * 19) % 38)}px`,
                    animationDelay: `${index * 70}ms`,
                  }}
                />
              ),
            )}
          </div>

          <p className="text-xs font-semibold tracking-[0.25em] text-white/45">
            DEVICE CALIBRATION
          </p>

          <h2 className="mt-3 text-4xl font-black uppercase leading-[0.9] tracking-[-0.055em] md:text-6xl">
            Tuning the
            <br />
            city for this device...
          </h2>

          <p className="mt-5 text-sm leading-6 text-white/45">
            Measuring safe brute-force limits,
            simulation cost and rendering quality.
            No fake progress percentage.
          </p>
        </div>
      </div>
    );
  }

  if (screen !== "ready" || !calibration) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-[#0d0f0e]/92 backdrop-blur-md">
      <div className="w-full max-w-2xl px-6">
        <p className="text-xs font-semibold tracking-[0.25em] text-[#f1c40f]">
          CALIBRATION COMPLETE
        </p>

        <h2 className="mt-3 text-7xl font-black tracking-[-0.07em] md:text-9xl">
          READY.
        </h2>

        <div className="mt-10 grid grid-cols-2 border-y border-white/15 md:grid-cols-4">
          <Stat
            label="TARGET LOAD"
            value="10,000"
          />

          <Stat
            label="RECOMMENDED"
            value={calibration.maxRecommended.toLocaleString()}
          />

          <Stat
            label="NAIVE LIMIT"
            value={calibration.naiveSafeLimit.toLocaleString()}
          />

          <Stat
            label="MEMORY PATH"
            value={
              calibration.sharedMemory
                ? "SHARED"
                : "TRANSFER"
            }
          />
        </div>

        <button
          type="button"
          onClick={enterCity}
          className="mt-8 flex items-center gap-3 bg-[#f1c40f] px-6 py-4 text-xs font-black tracking-[0.14em] text-black"
        >
          ENTER CITY
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-white/10 px-4 py-5 last:border-r-0">
      <div className="text-[9px] tracking-[0.18em] text-white/35">
        {label}
      </div>

      <div className="mt-2 text-sm font-bold">
        {value}
      </div>
    </div>
  );
}
