import {
  TRAFFIC_SPEED,
} from "../../data/routes";
import { STOP_BY_ID } from "../../data/stops";
import type {
  Danfo,
  GameState,
  StopId,
} from "../../types/game";
import { getRouteBetween } from "../routing";
import {
  boardForPath,
  deliverAtStop,
} from "./service";
import { rainModifier } from "./events";
import { dispatchDanfo } from "../dispatch";

interface Movement {
  danfo: Danfo;
  arrived: StopId | null;
}

function adjustedTraffic(
  base: number,
  resistance: number,
) {
  return 1 - (1 - base) * resistance;
}

function advance(
  state: GameState,
  danfo: Danfo,
  dt: number,
): Movement {
  if (danfo.status === "held") {
    return {
      danfo,
      arrived: null,
    };
  }

  if (danfo.status !== "moving") {
    return {
      danfo,
      arrived: null,
    };
  }

  const current = danfo.path[danfo.pathIndex];
  const next = danfo.path[danfo.pathIndex + 1];

  if (!next) {
    return {
      danfo: {
        ...danfo,
        status: "idle",
      },
      arrived: null,
    };
  }

  const route = getRouteBetween(current, next);

  if (!route) {
    return {
      danfo,
      arrived: null,
    };
  }

  const runtime = state.routes[route.id];

  if (runtime.closedUntil > state.now) {
    return {
      danfo,
      arrived: null,
    };
  }

  const from = STOP_BY_ID[current].position;
  const to = STOP_BY_ID[next].position;

  const distance = Math.max(
    1,
    Math.hypot(
      from[0] - to[0],
      from[2] - to[2],
    ),
  );

  const traffic = adjustedTraffic(
    TRAFFIC_SPEED[runtime.traffic],
    state.modifiers.trafficResistance,
  );

  const horn =
    danfo.hornUntil > state.now ? 1.7 : 1;

  const rate =
    (0.88 *
      danfo.speed *
      state.modifiers.speed *
      traffic *
      horn *
      rainModifier(state)) /
    distance;

  const progress = danfo.progress + rate * dt;

  const fuelUsed =
    (dt * 0.8) /
    state.modifiers.fuelEfficiency;

  const fuel = Math.max(
    0,
    danfo.fuel - fuelUsed,
  );

  if (fuel <= 0) {
    return {
      danfo: {
        ...danfo,
        fuel: 0,
        status: "out-of-fuel",
      },
      arrived: null,
    };
  }

  if (progress < 1) {
    return {
      danfo: {
        ...danfo,
        progress,
        fuel,
      },
      arrived: null,
    };
  }

  return {
    danfo: {
      ...danfo,
      node: next,
      pathIndex: danfo.pathIndex + 1,
      progress: 0,
      fuel,
    },
    arrived: next,
  };
}

function service(
  state: GameState,
  danfo: Danfo,
  stopId: StopId,
) {
  let nextState = state;
  let nextDanfo = danfo;

  const delivered = deliverAtStop(
    nextState,
    nextDanfo,
    stopId,
  );

  nextState = delivered.state;
  nextDanfo = delivered.danfo;

  const boarded = boardForPath(
    nextState,
    nextDanfo,
    stopId,
  );

  nextState = boarded.state;
  nextDanfo = boarded.danfo;

  if (STOP_BY_ID[stopId].refuel) {
    nextDanfo = {
      ...nextDanfo,
      fuel: 100,
    };
  }

  const complete =
    nextDanfo.pathIndex >=
    nextDanfo.path.length - 1;

  if (complete) {
    nextDanfo = {
      ...nextDanfo,
      destination: null,
      path: [stopId],
      pathIndex: 0,
      progress: 0,
      status: "idle",
      arrival: { at: state.now, message: `Arrived at ${STOP_BY_ID[stopId].name}` },
    };
  }

  return {
    state: nextState,
    danfo: nextDanfo,
  };
}

export function moveVehicles(
  state: GameState,
  dt: number,
): GameState {
  let nextState = state;
  const danfos: Danfo[] = [];

  for (const original of state.danfos) {
    const movement = advance(
      nextState,
      original,
      dt,
    );

    let danfo = movement.danfo;

    if (movement.arrived) {
      const result = service(
        nextState,
        danfo,
        movement.arrived,
      );

      nextState = result.state;
      danfo = result.danfo;
    }

    danfos.push(danfo);
  }

  nextState = {
    ...nextState,
    danfos,
  };

  // Dispatch only after every vehicle has been serviced, preserving all queue updates.
  for (const danfo of danfos) {
    if (danfo.status !== "idle" || !danfo.repeatRoute) continue;
    const destination = danfo.repeatRoute.find((stop) => stop !== danfo.node)!;
    if (danfo.fuel >= 20) nextState = dispatchDanfo(nextState, destination, danfo.id);
    if (nextState.danfos.find((item) => item.id === danfo.id)?.status === "moving") continue;
    nextState = {
      ...nextState,
      danfos: nextState.danfos.map((item) => item.id === danfo.id ? {
        ...item,
        repeatRoute: null,
        arrival: { at: state.now, message: danfo.fuel < 20 ? "Shuttle stopped: low fuel. Dispatch to a refuel stop." : "Shuttle stopped: no clear route. Choose a new destination." },
      } : item),
    };
  }
  return nextState;
}
