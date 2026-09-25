import {
  Camera,
  Gauge,
  Hand,
  MoreHorizontal,
  Pause,
  Play,
} from "lucide-react";
import { useSimulationStore } from "../store/useSimulationStore";

const populations = [
  [500, "500"],
  [1000, "1K"],
  [2500, "2.5K"],
  [5000, "5K"],
  [10000, "10K"],
] as const;

export function BottomDock() {
  const photoMode = useSimulationStore(
    (state) => state.photoMode,
  );

  const population = useSimulationStore(
    (state) => state.population,
  );

  const playing = useSimulationStore(
    (state) => state.playing,
  );

  const interaction = useSimulationStore(
    (state) => state.interaction,
  );

  const setPopulation = useSimulationStore(
    (state) => state.setPopulation,
  );

  const togglePlaying = useSimulationStore(
    (state) => state.togglePlaying,
  );

  const setInteraction = useSimulationStore(
    (state) => state.setInteraction,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
  );

  const setCamera = useSimulationStore(
    (state) => state.setCameraPreset,
  );

  if (photoMode) return null;

  return (
    <>
      <div className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center border border-white/10 bg-[#0c0d0c]/80 p-1.5 backdrop-blur-xl md:flex">
        <div className="flex border-r border-white/10 pr-1.5">
          {populations.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPopulation(value)}
              className={`px-3 py-2 text-[9px] font-bold tracking-[0.12em] transition ${
                population === value
                  ? "bg-[#f1c40f] text-black"
                  : "text-white/45 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={togglePlaying}
          className="ml-1.5 grid h-9 w-9 place-items-center text-white/60 hover:bg-white/10 hover:text-white"
        >
          {playing ? (
            <Pause size={14} />
          ) : (
            <Play size={14} />
          )}
        </button>

        <select
          value={interaction}
          onChange={(event) =>
            setInteraction(
              event.target.value as typeof interaction,
            )
          }
          className="h-9 border-l border-white/10 bg-transparent px-3 text-[9px] font-bold tracking-[0.12em] text-white/60 outline-none"
        >
          <option value="push">PUSH</option>
          <option value="attract">ATTRACT</option>
          <option value="vortex">VORTEX</option>
          <option value="roadblock">ROADBLOCK</option>
          <option value="inspect">INSPECT</option>
        </select>

        <button
          type="button"
          onClick={() => setPanel("engine")}
          className="flex h-9 items-center gap-2 border-l border-white/10 px-3 text-[9px] font-bold tracking-[0.12em] text-white/55 hover:text-white"
        >
          <Gauge size={13} />
          ENGINE
        </button>

        <button
          type="button"
          onClick={() => setCamera("top")}
          className="grid h-9 w-9 place-items-center border-l border-white/10 text-white/55 hover:text-white"
        >
          <Camera size={14} />
        </button>

        <button
          type="button"
          onClick={() => setPanel("more")}
          className="grid h-9 w-9 place-items-center border-l border-white/10 text-white/55 hover:text-white"
        >
          <MoreHorizontal size={15} />
        </button>
      </div>

      <div className="absolute inset-x-3 bottom-3 z-20 grid grid-cols-4 border border-white/10 bg-[#0c0d0c]/85 backdrop-blur-xl md:hidden">
        <MobileButton
          icon={<Gauge size={16} />}
          label="TRAFFIC"
          onClick={() => setPanel("more")}
        />

        <MobileButton
          icon={<Hand size={16} />}
          label={interaction.toUpperCase()}
          onClick={() => {
            const order = [
              "push",
              "attract",
              "vortex",
              "roadblock",
              "inspect",
            ] as const;

            const index =
              order.indexOf(interaction);

            setInteraction(
              order[(index + 1) % order.length],
            );
          }}
        />

        <MobileButton
          icon={<Gauge size={16} />}
          label="ENGINE"
          onClick={() => setPanel("engine")}
        />

        <MobileButton
          icon={<MoreHorizontal size={17} />}
          label="MORE"
          onClick={() => setPanel("more")}
        />
      </div>
    </>
  );
}

function MobileButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 flex-col items-center justify-center gap-1 border-r border-white/10 text-[8px] font-bold tracking-[0.12em] text-white/60 last:border-r-0"
    >
      {icon}
      {label}
    </button>
  );
}
