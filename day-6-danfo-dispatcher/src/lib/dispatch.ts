import { STOP_IDS } from "../data/stops";
import type {
  Danfo,
  GameState,
  StopId,
  UpgradeId,
} from "../types/game";
import {
  findPath,
  getTripDifficulty,
} from "./routing";
import {
  award,
  boardForPath,
} from "./sim/service";

export function dispatchDanfo(
  state: GameState,
  destination: StopId,
) {
  const id = state.selectedDanfoId;

  if (!id) return state;

  const index = state.danfos.findIndex(
    (danfo) => danfo.id === id,
  );

  if (index < 0) return state;

  const existing = state.danfos[index];

  if (existing.status !== "idle") return state;
  if (existing.node === destination) return state;

  const path = findPath(
    state,
    existing.node,
    destination,
  );

  if (path.length < 2) {
    return award(state, "NO CLEAR ROUTE", 0);
  }

  let danfo: Danfo = {
    ...existing,
    destination,
    path,
    pathIndex: 0,
    progress: 0,
    status: "moving",
    tripStartedAt: state.now,
    tripDifficulty: getTripDifficulty(path),
  };

  const boarded = boardForPath(
    state,
    danfo,
    danfo.node,
  );

  danfo = boarded.danfo;

  const danfos = [...boarded.state.danfos];
  danfos[index] = danfo;

  return {
    ...boarded.state,
    danfos,
  };
}

export function useHorn(state: GameState) {
  const selected = state.danfos.find(
    (danfo) =>
      danfo.id === state.selectedDanfoId,
  );

  if (!selected) return state;
  if (selected.status !== "moving") return state;
  if (selected.hornUses <= 0) return state;

  return {
    ...state,
    danfos: state.danfos.map((danfo) =>
      danfo.id === selected.id
        ? {
            ...danfo,
            hornUses: danfo.hornUses - 1,
            hornUntil: state.now + 6_000,
          }
        : danfo,
    ),
    burst: {
      id: `${state.now}-horn`,
      label: "HORN BOOST",
      points: 0,
      at: state.now,
    },
  };
}

export function payPolice(state: GameState): GameState {
  const incident = state.incident;

  if (
    incident?.type !== "police" ||
    !incident.danfoId ||
    !incident.bribeCost
  ) {
    return state;
  }

  if (state.cash < incident.bribeCost) return state;

  return {
    ...state,
    cash: state.cash - incident.bribeCost,
    incident: null,
    danfos: state.danfos.map((danfo) => {
      if (danfo.id !== incident.danfoId) {
        return danfo;
      }

      const moving =
        danfo.pathIndex < danfo.path.length - 1;

      return {
        ...danfo,
        heldUntil: state.now,
        status: moving ? "moving" : "idle",
      };
    }),
  };
}

export function buyDanfo(state: GameState) {
  const price = 4_000;

  if (state.cash < price) return state;

  const number = state.danfos.length + 1;

  const node =
    STOP_IDS[number % STOP_IDS.length] ?? "ikeja";

  const danfo: Danfo = {
    id: `danfo-${number}`,
    name: `DANFO ${String(number).padStart(2, "0")}`,
    node,
    destination: null,
    path: [node],
    pathIndex: 0,
    progress: 0,
    status: "idle",
    passengers: [],
    capacity: 8,
    speed: 1,
    fuel: 100,
    hornUses: 3,
    hornUntil: 0,
    heldUntil: 0,
    tripStartedAt: state.now,
    tripDifficulty: 1,
  };

  return {
    ...state,
    cash: state.cash - price,
    danfos: [...state.danfos, danfo],
  };
}

export function applyUpgrade(
  state: GameState,
  upgrade: UpgradeId,
): GameState {
  let next: GameState = {
    ...state,
    upgrades: [...state.upgrades, upgrade],
  };

  if (upgrade === "bigger-bus") {
    next.danfos = next.danfos.map((danfo) => ({
      ...danfo,
      capacity: danfo.capacity + 2,
    }));
  }

  if (upgrade === "sharp-driver") {
    next.modifiers = {
      ...next.modifiers,
      speed: next.modifiers.speed * 1.15,
    };
  }

  if (upgrade === "full-tank") {
    next.modifiers = {
      ...next.modifiers,
      fuelEfficiency:
        next.modifiers.fuelEfficiency * 1.25,
    };

    next.danfos = next.danfos.map((danfo) => ({
      ...danfo,
      fuel: 100,
    }));
  }

  if (upgrade === "area-boy") {
    next.modifiers = {
      ...next.modifiers,
      trafficResistance:
        next.modifiers.trafficResistance * 0.85,
    };
  }

  if (upgrade === "extra-horn") {
    next.danfos = next.danfos.map((danfo) => ({
      ...danfo,
      hornUses: danfo.hornUses + 1,
    }));
  }

  return {
    ...next,
    phase: "playing",
    paused: false,
    shift: state.shift + 1,
    shiftStartedAt: state.now,
    nextSpawnAt: state.now + 1_500,
    nextTrafficAt: state.now + 10_000,
    nextEventAt: state.now + 16_000,
    selectedDanfoId: null,
    incident: null,
  };
}