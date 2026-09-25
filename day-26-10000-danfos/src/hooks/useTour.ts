import { useEffect } from "react";
import { useSimulationStore } from "../store/useSimulationStore";

export function useTour() {
  const touring = useSimulationStore(
    (state) => state.touring,
  );

  useEffect(() => {
    if (!touring) return;

    const presets = [
      "city",
      "junction",
      "close",
      "top",
      "city",
    ] as const;

    let index = 0;

    const store = useSimulationStore.getState();

    store.setCameraPreset(presets[0]);

    const timer = window.setInterval(() => {
      index += 1;

      if (index >= presets.length) {
        window.clearInterval(timer);
        store.setTouring(false);
        return;
      }

      store.setCameraPreset(presets[index]);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [touring]);
}
