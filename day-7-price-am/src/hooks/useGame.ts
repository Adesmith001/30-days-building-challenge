/* eslint-disable react-hooks/purity */
import { useRef, useState } from "react";
import { prices } from "../data/prices";
import { makeRunDeck } from "../lib/random";
import {
  scoreGuess,
  scoreSkip,
} from "../lib/scoring";
import type {
  GamePhase,
  RoundResult,
} from "../types/game";

export function useGame() {
  const [deck] = useState(() => makeRunDeck(prices));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [skipsLeft, setSkipsLeft] = useState(3);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [phase, setPhase] =
    useState<GamePhase>("question");
  const [currentResult, setCurrentResult] =
    useState<RoundResult | null>(null);

  const startedAt = useRef(Date.now());

  const currentItem = deck[index];

  function lockGuess(guess: number) {
    if (phase !== "question") return;

    const elapsed = Date.now() - startedAt.current;

    const result = scoreGuess(
      currentItem,
      guess,
      streak,
      elapsed,
    );

    setCurrentResult(result);
    setResults((existing) => [...existing, result]);
    setScore((current) => current + result.points);
    setStreak(result.nextStreak);
    setBestStreak((current) =>
      Math.max(current, result.nextStreak),
    );
    setPhase("transition");
  }

  function revealResult() {
    if (phase === "transition") {
      setPhase("result");
    }
  }

  function skipCurrent() {
    if (phase !== "question" || skipsLeft <= 0) {
      return false;
    }

    const result = scoreSkip(currentItem, streak);

    setResults((existing) => [...existing, result]);
    setSkipsLeft((current) => current - 1);

    if (index >= deck.length - 1) {
      setPhase("complete");
      return true;
    }

    setIndex((current) => current + 1);
    setCurrentResult(null);
    startedAt.current = Date.now();

    return true;
  }

  function nextCard() {
    if (phase !== "result") return;

    if (index >= deck.length - 1) {
      setPhase("complete");
      return;
    }

    setIndex((current) => current + 1);
    setCurrentResult(null);
    setPhase("question");
    startedAt.current = Date.now();
  }

  return {
    deck,
    index,
    score,
    streak,
    bestStreak,
    skipsLeft,
    results,
    phase,
    currentItem,
    currentResult,
    lockGuess,
    revealResult,
    skipCurrent,
    nextCard,
  };
}