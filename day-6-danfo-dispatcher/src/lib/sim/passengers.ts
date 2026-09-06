import {
  STOP_BY_ID,
  STOP_IDS,
} from "../../data/stops";
import type {
  GameState,
  Passenger,
  StopId,
} from "../../types/game";
import { award } from "./service";

function randomStop(): StopId {
  return STOP_IDS[
    Math.floor(Math.random() * STOP_IDS.length)
  ];
}

function newPassenger(
  origin: StopId,
  destination: StopId,
  now: number,
): Passenger {
  return {
    id: `${now}-${Math.random()}`,
    origin,
    destination,
    waitingSince: now,
  };
}

export function spawnPassengers(
  state: GameState,
): GameState {
  if (state.now < state.nextSpawnAt) return state;

  const stops = { ...state.stops };

  const batch = Math.min(
    3,
    1 + Math.floor((state.shift - 1) / 2),
  );

  let spawned = 0;

  for (let i = 0; i < batch; i += 1) {
    const origin = randomStop();
    let destination = randomStop();

    while (destination === origin) {
      destination = randomStop();
    }

    stops[origin] = {
      ...stops[origin],
      waiting: [
        ...stops[origin].waiting,
        newPassenger(
          origin,
          destination,
          state.now,
        ),
      ],
    };

    spawned += 1;
  }

  const interval = Math.max(
    900,
    3_200 - state.shift * 260,
  );

  return {
    ...state,
    stops,
    nextSpawnAt: state.now + interval,
    stats: {
      ...state.stats,
      spawned: state.stats.spawned + spawned,
    },
  };
}

export function expirePassengers(
  state: GameState,
): GameState {
  const patience = Math.max(
    30_000,
    52_000 - state.shift * 2_000,
  );

  let lost = 0;
  const stops = { ...state.stops };

  STOP_IDS.forEach((id) => {
    const runtime = stops[id];

    const waiting = runtime.waiting.filter(
      (passenger) => {
        const expired =
          state.now - passenger.waitingSince >
          patience;

        if (expired) lost += 1;

        return !expired;
      },
    );

    stops[id] = {
      ...runtime,
      waiting,
    };
  });

  if (lost === 0) return state;

  const next: GameState = {
    ...state,
    stops,
    flow: 0,
    stats: {
      ...state.stats,
      lost: state.stats.lost + lost,
    },
  };

  return award(
    next,
    "PASSENGER LOST",
    -100 * lost,
  );
}

export function checkOverflows(
  state: GameState,
): GameState {
  for (const id of STOP_IDS) {
    const runtime = state.stops[id];
    const capacity = STOP_BY_ID[id].capacity;

    if (runtime.waiting.length < capacity) {
      continue;
    }

    if (
      state.now - runtime.lastOverflowAt <
      12_000
    ) {
      continue;
    }

    const waiting = runtime.waiting.slice(2);

    const next: GameState = {
      ...state,
      health: state.health - 1,
      flow: 0,
      stops: {
        ...state.stops,
        [id]: {
          waiting,
          lastOverflowAt: state.now,
        },
      },
      stats: {
        ...state.stats,
        lost: state.stats.lost + 2,
        overflows: state.stats.overflows + 1,
      },
    };

    return award(
      next,
      `${STOP_BY_ID[id].name} OVERFLOW`,
      -250,
    );
  }

  return state;
}