import {
  ROUTES,
  TRAFFIC_COST,
} from "../data/routes";
import {
  STOP_BY_ID,
  STOP_IDS,
} from "../data/stops";
import type {
  GameState,
  StopId,
} from "../types/game";

function distance(a: StopId, b: StopId) {
  const first = STOP_BY_ID[a].position;
  const second = STOP_BY_ID[b].position;

  return Math.hypot(
    first[0] - second[0],
    first[2] - second[2],
  );
}

export function getRouteBetween(
  first: StopId,
  second: StopId,
) {
  return ROUTES.find(
    (route) =>
      (route.from === first && route.to === second) ||
      (route.from === second && route.to === first),
  );
}

export function findPath(
  state: GameState,
  start: StopId,
  destination: StopId,
): StopId[] {
  if (start === destination) return [start];

  const unvisited = new Set(STOP_IDS);

  const distances = Object.fromEntries(
    STOP_IDS.map((id) => [id, Infinity]),
  ) as Record<StopId, number>;

  const previous: Partial<Record<StopId, StopId>> = {};

  distances[start] = 0;

  while (unvisited.size > 0) {
    const current = [...unvisited].reduce((best, id) =>
      distances[id] < distances[best] ? id : best,
    );

    if (distances[current] === Infinity) break;
    if (current === destination) break;

    unvisited.delete(current);

    const connected = ROUTES.filter(
      (route) =>
        route.from === current || route.to === current,
    );

    connected.forEach((route) => {
      const next =
        route.from === current ? route.to : route.from;

      if (!unvisited.has(next)) return;

      const runtime = state.routes[route.id];

      if (runtime.closedUntil > state.now) return;

      const weight =
        distance(current, next) *
        TRAFFIC_COST[runtime.traffic];

      const candidate = distances[current] + weight;

      if (candidate >= distances[next]) return;

      distances[next] = candidate;
      previous[next] = current;
    });
  }

  if (!Number.isFinite(distances[destination])) {
    return [];
  }

  const path: StopId[] = [];
  let current: StopId | undefined = destination;

  while (current) {
    path.unshift(current);

    if (current === start) break;

    current = previous[current];
  }

  return path;
}

export function getTripDifficulty(path: StopId[]) {
  if (path.length <= 1) return 1;

  const values = path
    .slice(0, -1)
    .map((stop, index) => {
      return getRouteBetween(stop, path[index + 1]);
    })
    .filter(Boolean)
    .map((route) => route!.difficulty);

  const total = values.reduce(
    (sum, value) => sum + value,
    0,
  );

  return total / Math.max(1, values.length);
}