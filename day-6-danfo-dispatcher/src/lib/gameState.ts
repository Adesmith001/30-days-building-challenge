import { ROUTES } from "../data/routes";
import { STOPS } from "../data/stops";
import type {
  Danfo,
  GamePhase,
  GameState,
  Passenger,
  StopId,
  StopRuntime,
} from "../types/game";

function id() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random()}`
  );
}

function emptyStops() {
  const stops = {} as Record<StopId, StopRuntime>;

  STOPS.forEach((stop) => {
    stops[stop.id] = {
      waiting: [],
      fullSince: null,
      lastOverflowAt: -20_000,
    };
  });

  return stops;
}

function passenger(
  origin: StopId,
  destination: StopId,
): Passenger {
  return {
    id: id(),
    origin,
    destination,
    waitingSince: 0,
  };
}

function createDanfo(
  number: number,
  node: StopId,
): Danfo {
  return {
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
    tripStartedAt: 0,
    tripDifficulty: 1,
    repeatRoute: null,
    arrival: null,
  };
}

function addStartingPassengers(
  stops: Record<StopId, StopRuntime>,
) {
  const seeds: [StopId, StopId][] = [
    ["yaba", "cms"],
    ["yaba", "cms"],
    ["yaba", "ikeja"],
    ["ojuelegba", "cms"],
    ["ojuelegba", "surulere"],
    ["ikeja", "yaba"],
    ["cms", "lekki"],
    ["surulere", "yaba"],
  ];

  seeds.forEach(([origin, destination]) => {
    stops[origin].waiting.push(
      passenger(origin, destination),
    );
  });

  return seeds.length;
}

export function createInitialGameState(
  phase: GamePhase = "landing",
  difficulty: GameState["difficulty"] = "standard",
): GameState {
  const stops = emptyStops();
  const startingPassengers =
    addStartingPassengers(stops);

  return {
    runId: id(),
    tutorial: true,
    difficulty,
    phase,
    now: 0,
    shift: 1,
    shiftStartedAt: 0,
    nextSpawnAt: 2_200,
    nextTrafficAt: 14_000,
    nextEventAt: difficulty === "relaxed" ? 40_000 : 30_000,
    score: 0,
    cash: 4_200,
    flow: 0,
    health: 3,
    gameSpeed: 1,
    paused: false,
    selectedDanfoId: null,
    stops,
    routes: Object.fromEntries(
      ROUTES.map((route) => [
        route.id,
        {
          traffic: "clear",
          closedUntil: 0,
        },
      ]),
    ),
    danfos: [
      createDanfo(1, "yaba"),
      createDanfo(2, "ikeja"),
      createDanfo(3, "cms"),
    ],
    incident: null,
    burst: null,
    delivery: null,
    modifiers: {
      speed: 1,
      fuelEfficiency: 1,
      trafficResistance: 1,
    },
    upgrades: [],
    stats: {
      spawned: startingPassengers,
      delivered: 0,
      lost: 0,
      overflows: 0,
      bestFlow: 0,
      shifts: 0,
    },
    endReason: null,
  };
}
