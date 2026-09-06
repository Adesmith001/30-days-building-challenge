import {
  useEffect,
  useReducer,
} from "react";
import { createInitialGameState } from "../lib/gameState";
import {
  gameReducer,
} from "../state/gameReducer";
import type {
  StopId,
  UpgradeId,
} from "../types/game";

export function useGame() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => createInitialGameState(),
  );

  useEffect(() => {
    if (state.phase !== "playing") return;

    const interval = window.setInterval(() => {
      dispatch({
        type: "TICK",
        dt: 0.033,
      });
    }, 33);

    return () => {
      window.clearInterval(interval);
    };
  }, [state.phase]);

  return {
    state,

    openBriefing() {
      dispatch({
        type: "OPEN_BRIEFING",
      });
    },

    start() {
      dispatch({
        type: "START",
      });
    },

    selectDanfo(id: string) {
      dispatch({
        type: "SELECT_DANFO",
        id,
      });
    },

    dispatchTo(destination: StopId) {
      dispatch({
        type: "DISPATCH",
        destination,
      });
    },

    setSpeed(speed: 1 | 2) {
      dispatch({
        type: "SET_SPEED",
        speed,
      });
    },

    togglePause() {
      dispatch({
        type: "TOGGLE_PAUSE",
      });
    },

    horn() {
      dispatch({
        type: "USE_HORN",
      });
    },

    payPolice() {
      dispatch({
        type: "PAY_POLICE",
      });
    },

    buyDanfo() {
      dispatch({
        type: "BUY_DANFO",
      });
    },

    upgrade(upgrade: UpgradeId) {
      dispatch({
        type: "APPLY_UPGRADE",
        upgrade,
      });
    },

    endRun() {
      dispatch({
        type: "END_RUN",
      });
    },

    records() {
      dispatch({
        type: "OPEN_RECORDS",
      });
    },

    home() {
      dispatch({
        type: "HOME",
      });
    },
  };
}