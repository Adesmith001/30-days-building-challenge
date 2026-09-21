export type Difficulty =
  | "easy"
  | "medium"
  | "hard";

export type RunMode =
  | "campaign"
  | "daily"
  | "sudden";

export type BattlePhase =
  | "intro"
  | "choosing"
  | "locked"
  | "charging"
  | "clashing"
  | "revealing"
  | "reward";

export type MetricId =
  | "area"
  | "population"
  | "density"
  | "igr"
  | "lgas"
  | "created";

export type Zone =
  | "North Central"
  | "North East"
  | "North West"
  | "South East"
  | "South South"
  | "South West";

export interface StateData {
  id: string;
  name: string;
  capital: string;
  zone: Zone;

  areaKm2: number;

  population2022: number;
  density2022: number;

  lgas: number;

  createdYear: number;
  createdLabel: string;

  igr2023: number;
}

export interface MetricDefinition {
  id: MetricId;

  battleName: string;
  label: string;
  question: string;

  unit: string;
  reference: string;

  sourceName: string;
  sourceUrl: string;
  lastVerified: string;

  higherWins: boolean;

  stateKey: keyof Pick<
    StateData,
    | "areaKm2"
    | "population2022"
    | "density2022"
    | "igr2023"
    | "lgas"
    | "createdYear"
  >;
}

export interface Battle {
  id: string;

  stateAId: string;
  stateBId: string;

  metricId: MetricId;

  difficulty: Difficulty;

  final: boolean;
}

export interface BattleVisual {
  shareA: number;
  shareB: number;

  closeness: number;

  impact:
    | "light"
    | "medium"
    | "heavy";
}

export interface BattleResult {
  battleId: string;

  stateAId: string;
  stateBId: string;

  metricId: MetricId;

  playerPick: string;
  winnerId: string;

  correct: boolean;

  difficulty: Difficulty;

  score: number;
  trophies: number;
  streakBonus: number;

  marginPercent: number;

  valueA: number;
  valueB: number;
}

export interface Settings {
  sound: boolean;
  fastBattles: boolean;
}

export interface RunSummary {
  id: string;
  date: string;

  mode: RunMode;

  score: number;

  wins: number;
  totalBattles: number;

  trophies: number;

  bestStreak: number;

  hardestWin: number | null;

  newStates: number;
}

export interface ProgressData {
  trophies: number;

  discovered: string[];

  bestScore: number;
  bestStreak: number;

  runsCompleted: number;

  history: RunSummary[];

  settings: Settings;
}

export interface ActiveRun {
  mode: RunMode;

  deck: Battle[];

  index: number;

  score: number;

  trophiesEarned: number;

  wins: number;

  streak: number;
  bestStreak: number;

  hardestWin: number | null;

  newDiscovered: string[];

  results: BattleResult[];
}

export interface RunResults {
  summary: RunSummary;

  trophiesBefore: number;
  trophiesAfter: number;
}