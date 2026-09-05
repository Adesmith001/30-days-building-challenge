/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { LevelConfig } from "../types/game";

export function useFreezeWindow(
  level: LevelConfig,
  active: boolean,
) {
  const [frozen, setFrozen] = useState(false);

  useEffect(() => {
    const enabled =
      active && level.mechanics.includes("freeze");

    if (!enabled) {
      setFrozen(false);
      return;
    }

    let thawTimer = 0;

    const openWindow = () => {
      setFrozen(true);

      window.clearTimeout(thawTimer);

      thawTimer = window.setTimeout(() => {
        setFrozen(false);
      }, 650);
    };

    const firstWindow = window.setTimeout(
      openWindow,
      1250,
    );

    const interval = window.setInterval(
      openWindow,
      2400,
    );

    return () => {
      window.clearTimeout(firstWindow);
      window.clearTimeout(thawTimer);
      window.clearInterval(interval);
    };
  }, [active, level.id, level.mechanics]);

  return frozen;
}