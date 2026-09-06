export type StopId =
  | "ikeja"
  | "oshodi"
  | "yaba"
  | "ojuelegba"
  | "surulere"
  | "cms"
  | "vi"
  | "lekki";

export type TrafficLevel =
  | "clear"
  | "slow"
  | "go-slow"
  | "madness";

export type DanfoStatus =
  | "idle"
  | "moving"
  | "held"
  | "out-of-fuel";

export type GamePhase =
  | "landing"
  | "briefing"
  | "playing"
  | "upgrade"
  | "results"
  | "records";

export type IncidentType =
  | "roadblock"
  | "rain"
  | "police"
  | "vip"
  | "clear";

export type UpgradeId =
  | "bigger-bus"
  | "sharp-driver"
  | "full-tank"
  | "area-boy"
  | "extra-horn";

export interface Passenger {
  id: string;
  origin: StopId;
  destination: StopId;
  waitingSince: number;
}

export interface StopRuntime {
  waiting: Passenger[];
  lastOverflowAt: number;
}

export interface RouteRuntime {
  traffic: TrafficLevel;
  closedUntil: number;
}

export interface Danfo {
  id: string;
  name: string;
  node: StopId;
  destination: StopId | null;
  path: StopId[];
  pathIndex: number;
  progress: number;
  status: DanfoStatus;
  passengers: Passenger[];
  capacity: number;
  speed: number;
  fuel: number;
  hornUses: number;
  hornUntil: number;
  heldUntil: number;
  tripStartedAt: number;
  tripDifficulty: number;
}

export interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  detail: string;
  expiresAt: number;
  routeId?: string;
  danfoId?: string;
  bribeCost?: number;
}

export interface ScoreBurst {
  id: string;
  label: string;
  points: number;
  at: number;
}

export interface GameModifiers {
  speed: number;
  fuelEfficiency: number;
  trafficResistance: number;
}

export interface GameStats {
  spawned: number;
  delivered: number;
  lost: number;
  overflows: number;
  bestFlow: number;
  shifts: number;
}

export interface GameState {
  runId: string;
  phase: GamePhase;
  now: number;
  shift: number;
  shiftStartedAt: number;
  nextSpawnAt: number;
  nextTrafficAt: number;
  nextEventAt: number;
  score: number;
  cash: number;
  flow: number;
  health: number;
  gameSpeed: 1 | 2;
  paused: boolean;
  selectedDanfoId: string | null;
  stops: Record<StopId, StopRuntime>;
  routes: Record<string, RouteRuntime>;
  danfos: Danfo[];
  incident: Incident | null;
  burst: ScoreBurst | null;
  modifiers: GameModifiers;
  upgrades: UpgradeId[];
  stats: GameStats;
  endReason: string | null;
}

export interface RunRecord {
  runId: string;
  date: string;
  score: number;
  delivered: number;
  lost: number;
  bestFlow: number;
  shift: number;
  efficiency: number;
  rank: string;
}