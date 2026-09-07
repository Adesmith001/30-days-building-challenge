export type Category =
  | "MARKET"
  | "FOOD"
  | "TRANSPORT"
  | "TECH"
  | "HOME"
  | "LAGOS LIFE";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type GuessDirection = "low" | "high" | "exact" | "skip";

export type GamePhase =
  | "question"
  | "transition"
  | "result"
  | "complete";

export interface PriceItem {
  id: string;
  category: Category;
  name: string;
  context: string;
  actualPrice: number;
  minPrice: number;
  maxPrice: number;
  step: number;
  difficulty: Difficulty;
  location: string;
  image: string;
}

export interface RoundResult {
  item: PriceItem;
  guess: number | null;
  skipped: boolean;
  direction: GuessDirection;
  error: number;
  errorPercent: number;
  accuracy: number;
  basePoints: number;
  speedBonus: number;
  multiplier: number;
  points: number;
  nextStreak: number;
  verdict: string;
}

export interface MarketRecords {
  bestScore: number;
  bestAccuracy: number;
  bestStreak: number;
  closestPercent: number | null;
  lowestSkips: number | null;
  gamesPlayed: number;
  totalValueAppraised: number;
}