export type PuzzleCategory =
  | "TECH"
  | "WORLD"
  | "SCIENCE"
  | "SPORTS"
  | "ENTERTAINMENT"
  | "EVERYDAY"
  | "HISTORY"
  | "NIGERIA"
  | "INTERNET"
  | "RANDOM";

export type Difficulty =
  | "easy"
  | "medium"
  | "hard"
  | "final";

export type SortDirection =
  | "asc"
  | "desc";

export type GameMode =
  | "normal"
  | "daily"
  | "category";

export type RoundState =
  | "playing"
  | "ready-to-lock"
  | "revealing"
  | "result";

export interface SortItem {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  image?: string;
  note?: string;
}

export interface SortPuzzle {
  id: string;
  prompt: string;
  direction: SortDirection;
  category: PuzzleCategory;
  difficulty: Difficulty;
  description?: string;
  items: SortItem[];
  fact: string;
}

export interface RoundResult {
  puzzleId: string;
  playerOrder: string[];
  correctOrder: string[];
  exactPositions: number;
  points: number;
  durationMs: number;
  hintUsed: boolean;
  perfect: boolean;
  nearMiss: boolean;
}

export interface GameSession {
  id: string;
  mode: GameMode;
  category?: PuzzleCategory;
  seed: string;
  puzzleIds: string[];
  roundIndex: number;
  score: number;
  results: RoundResult[];
  startedAt: number;
}

export interface RunRecord {
  id: string;
  date: string;
  mode:
    | GameMode
    | "blind"
    | "gap";
  category?: PuzzleCategory;
  score: number;
  maxScore: number;
  exactPositions: number;
  perfectOrders: number;
  fastestPerfectMs?: number;
  hintsUsed: number;
  rank: string;
}

export interface PlayerRecords {
  personalBest: number;
  fastestPerfectMs?: number;
  mostPerfectRounds: number;
  runsPlayed: number;
  completedPuzzleIds: string[];
  dailyResults: Record<string, RunRecord>;
}