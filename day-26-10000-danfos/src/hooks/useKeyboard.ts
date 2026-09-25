import { useEffect } from "react";
import { useSimulationStore } from "../store/useSimulationStore";

export function useKeyboard() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const store = useSimulationStore.getState();

      if (event.code === "Space") {
        event.preventDefault();
        store.togglePlaying();
      }

      if (event.key === "1") store.setPopulation(500);
      if (event.key === "2") store.setPopulation(1000);
      if (event.key === "3") store.setPopulation(2500);
      if (event.key === "4") store.setPopulation(5000);
      if (event.key === "5") store.setPopulation(10000);

      if (event.key.toLowerCase() === "g") {
        store.toggleOverlay("grid");
      }

      if (event.key.toLowerCase() === "h") {
        store.toggleOverlay("heatmap");
      }

      if (event.key.toLowerCase() === "e") {
        store.setPanel(
          store.panel === "engine" ? null : "engine",
        );
      }

      if (event.key.toLowerCase() === "r") {
        store.resetCity();
      }

      if (event.key === "Escape") {
        if (store.photoMode) {
          store.setPhotoMode(false);
        } else {
          store.setPanel(null);
          store.selectAgent(-1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () =>
      window.removeEventListener("keydown", onKeyDown);
  }, []);
}
