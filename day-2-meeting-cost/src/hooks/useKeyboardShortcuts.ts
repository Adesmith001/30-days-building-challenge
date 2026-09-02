import { useEffect } from "react";

import type { AppScreen } from "../types/meeting";

interface Props {
  screen: AppScreen;
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  onFocus: () => void;
  onHistory: () => void;
}

export function useKeyboardShortcuts({
  screen,
  paused,
  onPause,
  onResume,
  onEnd,
  onFocus,
  onHistory,
}: Props) {
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      const element = event.target as HTMLElement;

      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          element.tagName,
        )
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (event.code === "Space" && screen === "live") {
        event.preventDefault();

        if (paused) onResume();
        else onPause();
      }

      if (key === "e" && screen === "live") {
        onEnd();
      }

      if (key === "f" && screen === "live") {
        onFocus();
      }

      if (key === "h" && screen !== "live") {
        onHistory();
      }
    }

    window.addEventListener("keydown", keydown);

    return () =>
      window.removeEventListener("keydown", keydown);
  }, [
    onEnd,
    onFocus,
    onHistory,
    onPause,
    onResume,
    paused,
    screen,
  ]);
}