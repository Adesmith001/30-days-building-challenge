import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getKeyboardStatuses,
} from "../lib/evaluateGuess";

import {
  buildShareText,
  shareResult,
} from "../lib/share";

import {
  useSabiGame,
} from "../hooks/useSabiGame";

import type {
  GameMode,
  SabiWord,
} from "../types/game";

import {
  ClueCard,
} from "../components/ClueCard";

import {
  Keyboard,
} from "../components/Keyboard";

import {
  ResultPanel,
} from "../components/ResultPanel";

import {
  WordGrid,
} from "../components/WordGrid";

type Props = {
  entry: SabiWord;
  mode: GameMode;
  dateKey: string;
  onHome: () => void;
  onNext: () => void;
  onStatsChange:
    () => void;
};

export function GameScreen({
  entry,
  mode,
  dateKey,
  onHome,
  onNext,
  onStatsChange,
}: Props) {
  const game =
    useSabiGame({
      entry,
      mode,
      dateKey,
      onStatsChange,
    });

  const [
    shareState,
    setShareState,
  ] = useState("");

  const keyboardStatuses =
    useMemo(
      () =>
        getKeyboardStatuses(
          game.rows,
        ),
      [game.rows],
    );

  const gameOver =
    game.status !==
    "playing";

  useEffect(() => {
    function handleKey(
      event:
        KeyboardEvent,
    ) {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      if (
        event.key ===
        "Enter"
      ) {
        game.submitGuess();

        return;
      }

      if (
        event.key ===
        "Backspace"
      ) {
        game.removeLetter();

        return;
      }

      if (
        /^[a-zA-Z]$/.test(
          event.key,
        )
      ) {
        game.addLetter(
          event.key,
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleKey,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey,
      );
  });

  async function handleShare() {
    const text =
      buildShareText(
        mode,
        game.rows,
        game.status ===
          "won",
        game.attempts,
      );

    try {
      const result =
        await shareResult(
          text,
        );

      setShareState(
        result === "COPIED"
          ? "COPIED ✓"
          : "SHARED ✓",
      );
    } catch {
      setShareState(
        "TRY AGAIN",
      );
    }
  }

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-[760px]
        flex-1
        px-4
        py-6
        sm:px-8
        sm:py-9
      "
    >
      <div
        className="
          mb-6
          flex
          items-center
          justify-between
          border-b
          border-[#d9d2c8]
          pb-3
          font-mono
          text-[9px]
          tracking-[0.14em]
          text-[#6d6963]
          sm:text-[10px]
        "
      >
        <span>
          {mode === "daily"
            ? "DAILY SABI"
            : "SABI RUN"}
        </span>

        <span>
          {gameOver
            ? `SCORE ${game.score.toLocaleString()}`
            : `POT ${game.potentialScore.toLocaleString()}`}
        </span>

        <span>
          {Math.max(
            0,
            5 -
              game.attempts,
          )}{" "}
          TRIES LEFT
        </span>
      </div>

      <ClueCard
        entry={entry}
        hintUsed={
          game.hintUsed
        }
        onHint={
          game.useHint
        }
        disabled={
          gameOver
        }
      />

      <div
        className="
          py-7
          sm:py-9
        "
      >
        <WordGrid
          wordLength={
            entry.answer.length
          }
          rows={game.rows}
          currentGuess={
            game.currentGuess
          }
          gameOver={
            gameOver
          }
        />

        <p
          className="
            mt-4
            min-h-5
            text-center
            font-mono
            text-[9px]
            tracking-[0.12em]
            text-[#6d6963]
            sm:text-[10px]
          "
        >
          {game.message}
        </p>
      </div>

      <Keyboard
        statuses={
          keyboardStatuses
        }
        onLetter={
          game.addLetter
        }
        onEnter={
          game.submitGuess
        }
        onDelete={
          game.removeLetter
        }
        disabled={
          gameOver
        }
      />

      <ResultPanel
        entry={entry}
        mode={mode}
        status={
          game.status
        }
        attempts={
          game.attempts
        }
        score={
          game.score
        }
        shareState={
          shareState
        }
        onShare={
          handleShare
        }
        onNext={
          onNext
        }
        onHome={
          onHome
        }
      />
    </main>
  );
}