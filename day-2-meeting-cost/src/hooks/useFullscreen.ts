import { useEffect, useState } from "react";

export function useFullscreen() {
  const [fullscreen, setFullscreen] =
    useState(false);

  useEffect(() => {
    const update = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      update,
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        update,
      );
  }, []);

  async function toggle() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setFullscreen((value) => !value);
    }
  }

  return {
    fullscreen,
    toggle,
  };
}