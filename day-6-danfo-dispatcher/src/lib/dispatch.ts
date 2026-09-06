import { STOP_BY_ID } from "../data/stops";
import { passengerScore } from "./scoring";
import type {
  Danfo,
  GameState,
  StopId,
} from "../types/game";

export function award(
  state: GameState,
  label: string,
  points: number,
): GameState {
  return {
    ...state,
    score: Math.max(0, state.score + points),
    burst: {
      id: `${state.now}-${Math.random()}`,
      label,
      points,
      at: state.now,
    },
  };
}

export function deliverAtStop(
  state: GameState,
  danfo: Danfo,
  stopId: StopId,
) {
  const delivered = danfo.passengers.filter(
    (passenger) => passenger.destination === stopId,
  );

  if (delivered.length === 0) {
    return {
      state,
      danfo,
    };
  }

  const remaining = danfo.passengers.filter(
    (passenger) => passenger.destination !== stopId,
  );

  let flow = state.flow;
  let gained = 0;

  const fastDelivery =
    state.now - danfo.tripStartedAt <= 15_000;

  delivered.forEach(() => {
    flow += 1;

    gained += passengerScore(
      danfo.tripDifficulty,
      flow,
      fastDelivery,
    );
  });

  const nextState: GameState = {
    ...state,
    flow,
    cash: state.cash + delivered.length * 150,
    stats: {
      ...state.stats,
      delivered:
        state.stats.delivered + delivered.length,
      bestFlow: Math.max(
        state.stats.bestFlow,
        flow,
      ),
    },
  };

  return {
    state: award(
      nextState,
      `${delivered.length} DELIVERED`,
      gained,
    ),
    danfo: {
      ...danfo,
      passengers: remaining,
    },
  };
}

export function boardForPath(
  state: GameState,
  danfo: Danfo,
  stopId: StopId,
) {
  const runtime = state.stops[stopId];
  const before = runtime.waiting.length;
  const available =
    danfo.capacity - danfo.passengers.length;

  if (available <= 0) {
    return {
      state,
      danfo,
    };
  }

  const future = new Set(
    danfo.path.slice(danfo.pathIndex + 1),
  );

  const boarded = [];
  const waiting = [];

  for (const passenger of runtime.waiting) {
    if (
      boarded.length < available &&
      future.has(passenger.destination)
    ) {
      boarded.push(passenger);
    } else {
      waiting.push(passenger);
    }
  }

  if (boarded.length === 0) {
    return {
      state,
      danfo,
    };
  }

  let nextState: GameState = {
    ...state,
    stops: {
      ...state.stops,
      [stopId]: {
        ...runtime,
        waiting,
      },
    },
  };

  const nextDanfo: Danfo = {
    ...danfo,
    passengers: [
      ...danfo.passengers,
      ...boarded,
    ],
  };

  const stopCapacity = STOP_BY_ID[stopId].capacity;

  const wasCritical =
    before >= Math.ceil(stopCapacity * 0.8);

  const nowSafe =
    waiting.length <= Math.ceil(stopCapacity * 0.3);

  if (wasCritical && nowSafe) {
    nextState = award(
      nextState,
      "LAST-MINUTE SAVE",
      300,
    );
  }

  if (
    nextDanfo.passengers.length ===
      nextDanfo.capacity &&
    danfo.passengers.length < danfo.capacity
  ) {
    nextState = award(
      nextState,
      "FULL LOAD",
      150,
    );
  }

  return {
    state: nextState,
    danfo: nextDanfo,
  };
}