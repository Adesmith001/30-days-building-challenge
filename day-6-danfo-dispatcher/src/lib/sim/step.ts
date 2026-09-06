import type { GameState } from "../../types/game";
import {
  checkOverflows,
  expirePassengers,
  spawnPassengers,
} from "./passengers";
import { updateTraffic } from "./traffic";
import {
  clearExpiredIncident,
  maybeTriggerEvent,
} from "./events";
import { moveVehicles } from "./vehicles";

export function shiftDurationMs(shift: number) {
  if (shift <= 1) return 90_000;
  if (shift === 2) return 100_000;
  if (shift === 3) return 110_000;

  return 120_000;
}

export function stepSimulation(
  state: GameState,
  realDt: number,
): GameState {
  if (state.phase !== "playing") return state;
  if (state.paused) return state;

  const dt =
    Math.min(realDt, 0.1) * state.gameSpeed;

  let next: GameState = {
    ...state,
    now: state.now + dt * 1_000,
  };

  next = clearExpiredIncident(next);
  next = spawnPassengers(next);
  next = expirePassengers(next);
  next = updateTraffic(next);
  next = maybeTriggerEvent(next);
  next = moveVehicles(next, dt);
  next = checkOverflows(next);

  if (next.health <= 0) {
    return {
      ...next,
      phase: "results",
      paused: true,
      endReason:
        "LAGOS HAS STOPPED MOVING.",
    };
  }

  const elapsed =
    next.now - next.shiftStartedAt;

  if (elapsed >= shiftDurationMs(next.shift)) {
    return {
      ...next,
      phase: "upgrade",
      paused: true,
      stats: {
        ...next.stats,
        shifts: Math.max(
          next.stats.shifts,
          next.shift,
        ),
      },
    };
  }

  return next;
}