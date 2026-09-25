import { useSimulationStore } from "../store/useSimulationStore";

export function TopBar() {
  const photoMode = useSimulationStore(
    (state) => state.photoMode,
  );

  const setPanel = useSimulationStore(
    (state) => state.setPanel,
  );

  if (photoMode) return null;

  const source =
    import.meta.env.VITE_SOURCE_URL as
      | string
      | undefined;

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between border-b border-white/[0.07] bg-black/15 px-4 text-[9px] font-semibold tracking-[0.2em] backdrop-blur-sm md:px-6">
      <span className="text-white/55">
        26 / 30
      </span>

      <span className="absolute left-1/2 -translate-x-1/2 font-black text-white/80">
        10,000 DANFOS
      </span>

      <div className="pointer-events-auto flex gap-4 text-white/45">
        <button
          type="button"
          onClick={() => setPanel("about")}
          className="hover:text-white"
        >
          ABOUT
        </button>

        {source && (
          <button
            type="button"
            onClick={() =>
              window.open(
                source,
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="hover:text-white"
          >
            SOURCE ↗
          </button>
        )}
      </div>
    </header>
  );
}
