export type TemplateType =
  | "analytics"
  | "checkout"
  | "flight"
  | "music"
  | "weather";

export type QuestionCategory =
  | "colour"
  | "number"
  | "position"
  | "text";

export type GamePhase =
  | "intro"
  | "countdown"
  | "stimulus"
  | "blank"
  | "question"
  | "feedback"
  | "reveal"
  | "results";

export type AnswerOption = {
  id: string;
  label: string;
};

export type Question = {
  prompt: string;
  category: QuestionCategory;
  correctAnswer: string;
  options: AnswerOption[];
  focusKey: string;
};

export type StimulusData = Record<
  string,
  string | number | boolean | string[]
>;

export type Stimulus = {
  id: string;
  template: TemplateType;
  data: StimulusData;
  question: Question;
};

export type RoundResult = {
  round: number;
  category: QuestionCategory;
  correct: boolean;
  exposure: number;
  points: number;
};

export type GameStats = {
  score: number;
  streak: number;
  bestStreak: number;
  correct: number;
  exposure: number;
};

export type StoredStats = {
  personalBest: number;
  highestStreak: number;
  shortestThreshold: number;
  sessionsPlayed: number;
};