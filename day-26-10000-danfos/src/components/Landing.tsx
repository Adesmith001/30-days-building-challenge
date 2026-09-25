import { ArrowRight } from "lucide-react";
import { useSimulationStore } from "../store/useSimulationStore";

export function Landing() {
  const startExperience = useSimulationStore(
    (state) => state.startExperience,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-end bg-gradient-to-t from-[#0b0c0b]/95 via-[#0b0c0b]/30 to-transparent md:items-center">
      <div className="pointer-events-auto w-full px-5 pb-24 md:px-12 md:pb-0 lg:px-20">
        <p className="mb-4 text-[10px] font-semibold tracking-[0.28em] text-white/45">
          DAY 26 / 30 · MULTI-AGENT SYSTEM
        </p>

        <h1 className="max-w-5xl text-[clamp(4rem,11vw,10rem)] font-black leading-[0.76] tracking-[-0.075em] text-[#f1c40f]">
          10,000
          <br />
          DANFOS.
        </h1>

        <div className="mt-7 max-w-2xl md:mt-10">
          <h2 className="text-xl font-bold uppercase leading-tight tracking-[-0.03em] text-white md:text-4xl">
            How many can
            <br />
            your browser handle?
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-6 text-white/55 md:text-base">
            A Lagos-inspired traffic simulation
            built to break — then optimized not to.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startExperience}
              className="group flex items-center gap-3 bg-[#f1c40f] px-5 py-3 text-xs font-black tracking-[0.12em] text-[#13130f] transition hover:bg-[#ffda32]"
            >
              START TRAFFIC
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onClick={() => setPanel("about")}
              className="border border-white/20 bg-black/20 px-5 py-3 text-xs font-semibold tracking-[0.12em] text-white backdrop-blur-md transition hover:border-white/50"
            >
              SEE HOW IT WORKS
            </button>
          </div>

          <p className="mt-5 text-[9px] font-semibold tracking-[0.24em] text-white/35">
            BOIDS · SPATIAL HASHING · INSTANCED
            RENDERING · WORKERS · WEBGPU LAB
          </p>
        </div>
      </div>
    </div>
  );
}
