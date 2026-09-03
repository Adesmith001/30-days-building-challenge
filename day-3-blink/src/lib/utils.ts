import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number) {
  return score.toLocaleString();
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItem<T>(items: T[]) {
  return items[randomInt(0, items.length - 1)];
}

export function shuffle<T>(items: T[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}