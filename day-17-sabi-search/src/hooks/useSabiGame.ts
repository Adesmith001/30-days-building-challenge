import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MAX_ATTEMPTS,
} from "../data/words";

import {
  evaluateGuess,
} from "../lib/evaluateGuess";

import {
  calculateScore,
} from "../lib/score";

import {
  saveResult,
} from "../lib/storage";

import type {
  GameMode,
  GameStatus,
  SabiWord,
} from "../types/game";

interface Options {
  entry: SabiWord;
  mode: GameMode;
  dateKey: string;
  onStatsChange: () => void;
}

export function useSabiGame({
  entry,
  mode,
  dateKey,
  onStatsChange,
}: Options) {
  const [
    guesses,
    setGuesses,
  ] = useState<string[]>([]);

  const [
    currentGuess,
    setCurrentGuess,
  ] = useState("");

  const [
    status,
    setStatus,
  ] =
    useState<GameStatus>(
      "playing",
    );

  const [
    hintUsed,
    setHintUsed,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState(
    "Find the word from the clue.",
  );

  const recorded =
    useRef(false);

  const rows = useMemo(
    () =>
      guesses.map((guess) =>
        evaluateGuess(
          guess,
          entry.answer,
        ),
      ),
    [
      entry.answer,
      guesses,
    ],
  );

  const attempts =
    guesses.length;

  const score =
    calculateScore(
      attempts,
      hintUsed,
      status === "won",
    );

  const potentialScore =
    calculateScore(
      Math.min(
        attempts + 1,
        MAX_ATTEMPTS,
      ),
      hintUsed,
      true,
    );

  useEffect(() => {
    if (
      status === "playing" ||
      recorded.current
    ) {
      return;
    }

    recorded.current = true;

    saveResult({
      id:
        crypto.randomUUID?.() ??
        `${Date.now()}`,

      date: dateKey,
      mode,
      answer: entry.answer,
      won: status === "won",
      attempts,
      score,
      rows,
    });

    onStatsChange();
  }, [
    attempts,
    dateKey,
    entry.answer,
    mode,
    onStatsChange,
    rows,
    score,
    status,
  ]);

  function addLetter(
    letter: string,
  ) {
    if (
      status !== "playing" ||
      currentGuess.length >=
        entry.answer.length
    ) {
      return;
    }

    if (
      !/^[A-Z]$/i.test(
        letter,
      )
    ) {
      return;
    }

    setCurrentGuess(
      (value) =>
        value +
        letter.toUpperCase(),
    );
  }

  function removeLetter() {
    if (
      status !== "playing"
    ) {
      return;
    }

    setCurrentGuess(
      (value) =>
        value.slice(0, -1),
    );
  }

  function submitGuess() {
    if (
      status !== "playing"
    ) {
      return;
    }

    if (
      currentGuess.length !==
      entry.answer.length
    ) {
      setMessage(
        `Need ${entry.answer.length} letters, no shortcut.`,
      );

      return;
    }

    if (
      guesses.includes(
        currentGuess,
      )
    ) {
      setMessage(
        "You don try that one already.",
      );

      return;
    }

    const next = [
      ...guesses,
      currentGuess,
    ];

    setGuesses(next);
    setCurrentGuess("");

    if (
      currentGuess ===
      entry.answer
    ) {
      setStatus("won");

      setMessage(
        "You sabi! Correct word.",
      );

      return;
    }

    if (
      next.length >=
      MAX_ATTEMPTS
    ) {
      setStatus("lost");

      setMessage(
        `This one escape you. Na ${entry.answer}.`,
      );

      return;
    }

    setMessage(
      `${
        MAX_ATTEMPTS -
        next.length
      } tries left. Shine your eye.`,
    );
  }

  function useHint() {
    if (
      status !== "playing" ||
      hintUsed
    ) {
      return;
    }

    setHintUsed(true);

    setMessage(
      "Hint opened. Small points don comot.",
    );
  }

  return {
    guesses,
    rows,
    currentGuess,
    status,
    hintUsed,
    message,
    attempts,
    score,
    potentialScore,
    addLetter,
    removeLetter,
    submitGuess,
    useHint,
  };
}