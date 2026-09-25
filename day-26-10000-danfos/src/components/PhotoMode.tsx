import { useSimulationStore } from "../store/useSimulationStore";

export function PhotoMode() {
  const photoMode = useSimulationStore(
    (state) => state.photoMode,
  );

  const setPhotoMode = useSimulationStore(
    (state) => state.setPhotoMode,
  );

  const setCamera = useSimulationStore(
    (state) => state.setCameraPreset,
  );

  if (!photoMode) return null;

  const save = () => {
    const canvas = document.querySelector(
      "canvas",
    ) as HTMLCanvasElement | null;

    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "10000-danfos-city.png";
      link.click();

      URL.revokeObjectURL(url);
    });
  };

  return (
    <>
      <div className="pointer-events-none absolute left-5 top-5 z-20">
        <div className="text-xs font-black tracking-[0.18em]">
          10,000 DANFOS
        </div>

        <div className="mt-1 text-[8px] tracking-[0.2em] text-white/35">
          DAY 26 / 30
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 border border-white/10 bg-black/55 backdrop-blur-lg">
        {(["city", "top", "junction"] as const).map(
          (camera) => (
            <button
              key={camera}
              type="button"
              onClick={() => setCamera(camera)}
              className="border-r border-white/10 px-4 py-3 text-[8px] font-bold tracking-[0.14em] text-white/50"
            >
              {camera.toUpperCase()}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={save}
          className="border-r border-white/10 px-4 py-3 text-[8px] font-bold tracking-[0.14em] text-[#f1c40f]"
        >
          SAVE
        </button>

        <button
          type="button"
          onClick={() => setPhotoMode(false)}
          className="px-4 py-3 text-[8px] font-bold tracking-[0.14em] text-white/50"
        >
          EXIT
        </button>
      </div>
    </>
  );
}
