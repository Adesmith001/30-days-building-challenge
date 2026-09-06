import { ROUTES } from "../../data/routes";
import type {
  GameState,
  TrafficLevel,
} from "../../types/game";

function randomTraffic(
  shift: number,
): TrafficLevel {
  const roll = Math.random();

  if (shift >= 4 && roll > 0.82) {
    return "madness";
  }

  if (roll > 0.62) {
    return "go-slow";
  }

  if (roll > 0.35) {
    return "slow";
  }

  return "clear";
}

export function updateTraffic(
  state: GameState,
): GameState {
  if (state.now < state.nextTrafficAt) {
    return state;
  }

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
        traffic: randomTraffic(state.shift),
      },
    },
    nextTrafficAt:
      state.now +
      14_000 +
      Math.random() * 9_000,
  };
}