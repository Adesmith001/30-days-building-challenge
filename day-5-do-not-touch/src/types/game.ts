export type GamePhase =
  | "intro"
  | "level-intro"
  | "playing"
  | "level-complete"
  | "boss-ending"
  | "results";

export type Mechanic =
  | "dodge"
  | "teleport"
  | "shrink"
  | "decoy"
  | "predictive"
  | "slow"
  | "freeze"
  | "boss";

export interface Point {
  x: number;
  y: number;
}

export interface PointerSnapshot extends Point {
  previousX: number;
  previousY: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  acceleration: number;
  pointerType: string;
  inside: boolean;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  protocol: string;
  difficulty: number;
  dangerRadius: number;
  moveDistance: number;
  cooldownMs: number;
  buttonWidth: number;
  mechanics: Mechanic[];
  predictionMs?: number;
  decoys?: number;
  touchEvadeChance: number;
}

export interface CatchSummary {
  elapsedMs: number;
  misses: number;
  points: number;
  clean: boolean;
  fast: boolean;
  perfect: boolean;
  streak: number;
  label: string;
}

export interface CatchOutcome {
  completed: boolean;
  points: number;
  label: string;
}

export interface RunStats {
  score: number;
  levelsCleared: number;
  totalTimeMs: number;
  misses: number;
  cleanCatches: number;
  bestStreak: number;
  fastestCatchMs: number | null;
}

export interface PersonalBest {
  score: number;
  fastestRunMs: number | null;
  fewestMisses: number | null;
  fastestCatchMs: number | null;
  bestStreak: number;
}

export interface ScoreBurstData {
  id: number;
  points: number;
  label: string;
  x: number;
  y: number;
}