import { ROUTES } from "../../data/routes";
import type {
  Danfo,
  GameState,
  Incident,
} from "../../types/game";

function incident(
  state: GameState,
  data: Omit<Incident, "id">,
): Incident {
  return {
    id: `${state.now}-${Math.random()}`,
    ...data,
  };
}

export function clearExpiredIncident(
  state: GameState,
): GameState {
  if (!state.incident) return state;

  if (state.incident.expiresAt > state.now) {
    return state;
  }

  return {
    ...state,
    incident: null,
    danfos: state.danfos.map((danfo) => {
      if (
        danfo.status !== "held" ||
        danfo.heldUntil > state.now
      ) {
        return danfo;
      }

      const moving =
        danfo.pathIndex < danfo.path.length - 1;

      return {
        ...danfo,
        status: moving ? "moving" : "idle",
      };
    }),
  };
}

function policeEvent(
  state: GameState,
): GameState {
  const candidates = state.danfos.filter(
    (danfo) => danfo.status !== "out-of-fuel",
  );

  if (candidates.length === 0) return state;

  const chosen =
    candidates[
      Math.floor(Math.random() * candidates.length)
    ];

  const heldUntil = state.now + 12_000;

  return {
    ...state,
    danfos: state.danfos.map((danfo) =>
      danfo.id === chosen.id
        ? {
            ...danfo,
            status: "held",
            heldUntil,
          }
        : danfo,
    ),
    incident: incident(state, {
      type: "police",
      title: "POLICE STOP",
      detail:
        `${chosen.name} has entered paperwork territory.`,
      expiresAt: heldUntil,
      danfoId: chosen.id,
      bribeCost: 400,
    }),
  };
}

function roadblockEvent(
  state: GameState,
): GameState {
  const route =
    ROUTES[
      Math.floor(Math.random() * ROUTES.length)
    ];

  const expiry = state.now + 12_000;

  return {
    ...state,
    routes: {
      ...state.routes,
      [route.id]: {
        ...state.routes[route.id],
        closedUntil: expiry,
      },
    },
    incident: incident(state, {
      type: "roadblock",
      title: "ROAD BLOCK",
      detail:
        `${route.name} closed temporarily. Reroute.`,
      expiresAt: expiry,
      routeId: route.id,
    }),
  };
}

function weatherEvent(
  state: GameState,
): GameState {
  return {
    ...state,
    incident: incident(state, {
      type: "rain",
      title: "RAIN",
      detail:
        "Road grip is down. Every corridor is slower.",
      expiresAt: state.now + 10_000,
    }),
  };
}

function vipEvent(state: GameState): GameState {
  const route =
    ROUTES[
      Math.floor(Math.random() * ROUTES.length)
    ];

  return {
    ...state,
    routes: {
      ...state.routes,
      [route.id]: {
        ...state.routes[route.id],
        traffic: "madness",
      },
    },
    incident: incident(state, {
      type: "vip",
      title: "VIP MOVEMENT",
      detail:
        `${route.name}: traffic is suddenly doing ceremony.`,
      expiresAt: state.now + 12_000,
      routeId: route.id,
    }),
  };
}

function clearRoadEvent(
  state: GameState,
): GameState {
  const route =
    ROUTES[
      Math.floor(Math.random() * ROUTES.length)
    ];

  return {
    ...state,
    routes: {
      ...state.routes,
      [route.id]: {
        traffic: "clear",
        closedUntil: 0,
      },
    },
    incident: incident(state, {
      type: "clear",
      title: "ROAD CLEARED",
      detail:
        `${route.name} is moving suspiciously well.`,
      expiresAt: state.now + 7_000,
    }),
  };
}

export function maybeTriggerEvent(
  state: GameState,
): GameState {
  if (state.incident) return state;
  if (state.now < state.nextEventAt) return state;

  const roll = Math.floor(Math.random() * 5);

  let next = state;

  if (roll === 0) next = roadblockEvent(state);
  if (roll === 1) next = weatherEvent(state);
  if (roll === 2) next = policeEvent(state);
  if (roll === 3) next = vipEvent(state);
  if (roll === 4) next = clearRoadEvent(state);

  const delay = Math.max(
    15_000,
    31_000 - state.shift * 1_500,
  );

  return {
    ...next,
    nextEventAt:
      state.now + delay + Math.random() * 5_000,
  };
}

export function rainModifier(state: GameState) {
  return state.incident?.type === "rain"
    ? 0.72
    : 1;
}

export function resumeStatus(
  danfo: Danfo,
): Danfo["status"] {
  return danfo.pathIndex <
    danfo.path.length - 1
    ? "moving"
    : "idle";
}