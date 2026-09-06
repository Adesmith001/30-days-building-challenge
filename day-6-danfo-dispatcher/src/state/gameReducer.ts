import {
  activateHorn,
  applyUpgrade,
  buyDanfo,
  dispatchDanfo,
  payPolice,
} from "../lib/dispatch";
import { createInitialGameState } from "../lib/gameState";
import { stepSimulation } from "../lib/sim/step";
import type {
  GameState,
  StopId,
  UpgradeId,
} from "../types/game";

export type GameAction =
  | { type: "TOGGLE_REPEAT" }
  | { type: "SET_DIFFICULTY"; difficulty: GameState["difficulty"] }
  | { type: "REPLAY" }
  | { type: "REFUEL" }
  | { type: "SKIP_TUTORIAL" }
  | {
      type: "OPEN_BRIEFING";
    }
  | {
      type: "START";
    }
  | {
      type: "TICK";
      dt: number;
    }
  | {
      type: "SELECT_DANFO";
      id: string;
    }
  | {
      type: "DISPATCH";
      destination: StopId;
    }
  | {
      type: "SET_SPEED";
      speed: 1 | 2;
    }
  | {
      type: "TOGGLE_PAUSE";
    }
  | {
      type: "USE_HORN";
    }
  | {
      type: "PAY_POLICE";
    }
  | {
      type: "BUY_DANFO";
    }
  | {
      type: "APPLY_UPGRADE";
      upgrade: UpgradeId;
    }
  | {
      type: "END_RUN";
    }
  | {
      type: "OPEN_RECORDS";
    }
  | {
      type: "HOME";
    };

export function gameReducer(
  state: GameState,
  action: GameAction,
): GameState {
  if (action.type === "SET_DIFFICULTY" && state.phase === "briefing") {
    return createInitialGameState("briefing", action.difficulty);
  }
  if (action.type === "REPLAY") {
    return { ...createInitialGameState("playing", state.difficulty), tutorial: false };
  }
  if (action.type === "REFUEL") {
    if (state.cash < 300 || state.phase !== "playing") return state;
    const selected = state.danfos.find((d) => d.id === state.selectedDanfoId);
    if (!selected || (selected.status !== "out-of-fuel" && selected.status !== "idle") || selected.fuel >= 100) return state;
    return { ...state, cash: state.cash - 300, danfos: state.danfos.map((d) => d.id === selected.id ? {
      ...d, fuel: 100, status: d.pathIndex < d.path.length - 1 ? "moving" : "idle", arrival: null,
    } : d) };
  }
  if (action.type === "TOGGLE_REPEAT") {
    return {
      ...state,
      danfos: state.danfos.map((danfo) => {
        if (danfo.id !== state.selectedDanfoId) return danfo;
        if (danfo.repeatRoute) return { ...danfo, repeatRoute: null };
        if (danfo.status !== "moving" || !danfo.destination) return danfo;
        return { ...danfo, repeatRoute: [danfo.path[0], danfo.destination] as [StopId, StopId] };
      }),
    };
  }
  if (action.type === "SKIP_TUTORIAL") return { ...state, tutorial: false };
  if (action.type === "OPEN_BRIEFING") {
    return createInitialGameState("briefing", state.difficulty);
  }

  if (action.type === "START") {
    return {
      ...state,
      phase: "playing",
      paused: false,
      shiftStartedAt: state.now,
    };
  }

  if (action.type === "TICK") {
    return stepSimulation(state, action.dt);
  }

  if (action.type === "SELECT_DANFO") {
    return {
      ...state,
      selectedDanfoId: action.id,
    };
  }

  if (action.type === "DISPATCH") {
    return dispatchDanfo(
      state,
      action.destination,
    );
  }

  if (action.type === "SET_SPEED") {
    return {
      ...state,
      gameSpeed: action.speed,
    };
  }

  if (action.type === "TOGGLE_PAUSE") {
    return {
      ...state,
      paused: !state.paused,
    };
  }

  if (action.type === "USE_HORN") {
    return activateHorn(state);
  }

  if (action.type === "PAY_POLICE") {
    return payPolice(state);
  }

  if (action.type === "BUY_DANFO") {
    return buyDanfo(state);
  }

  if (action.type === "APPLY_UPGRADE") {
    return applyUpgrade(
      state,
      action.upgrade,
    );
  }

  if (action.type === "END_RUN") {
    return {
      ...state,
      phase: "results",
      paused: true,
      endReason: "SHIFT TERMINATED.",
    };
  }

  if (action.type === "OPEN_RECORDS") {
    return {
      ...state,
      phase: "records",
    };
  }

  if (action.type === "HOME") {
    return createInitialGameState("landing", state.difficulty);
  }

  return state;
}
