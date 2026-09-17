export type LetterStatus =
  | "correct"
  | "present"
  | "absent"
  | "empty";

export type GameMode =
  | "daily"
  | "run";

export type GameStatus =
  | "playing"
  | "won"
  | "lost";

export type Category =
  | "SLANG"
  | "PIDGIN"
  | "FOOD"
  | "STREET"
  | "CULTURE"
  | "LAGOS";

export interface SabiWord {
  answer: string;
  category: Category;
  clue: string;
  hint: string;
  reveal: string;
  example: string;
}

export interface EvaluatedLetter {
  letter: string;
  status: LetterStatus;
}

export interface HistoryItem {
  id: string;
  date: string;
  mode: GameMode;
  answer: string;
  won: boolean;
  attempts: number;
  score: number;
  rows: EvaluatedLetter[][];
}

export interface GameStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  totalAttempts: number;
  distribution: Record<string, number>;
  history: HistoryItem[];
}