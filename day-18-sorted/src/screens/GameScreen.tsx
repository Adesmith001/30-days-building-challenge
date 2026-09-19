import {
  AppShell,
} from "../components/AppShell";

import {
  GameHeader,
} from "../components/GameHeader";

import {
  RoundBoard,
} from "../components/RoundBoard";

import {
  puzzleMap,
} from "../data/puzzles";

import type {
  GameSession,
  RoundResult,
} from "../types/game";

interface Props {
  session: GameSession;
  onResult: (
    result: RoundResult,
  ) => void;
  onNext: () => void;
  onDone: () => void;
  onHome: () => void;
}

export function GameScreen({
  session,
  onResult,
  onNext,
  onDone,
  onHome,
}: Props) {
  const puzzleId =
    session.puzzleIds[
      session.roundIndex
    ];

  const puzzle =
    puzzleMap.get(
      puzzleId,
    );

  if (!puzzle) {
    return null;
  }

  const total =
    session.puzzleIds
      .length;

  const isLast =
    session.roundIndex ===
    total - 1;

  return (
    <AppShell
      hideNav
      onNavigate={() =>
        onHome()
      }
    >
      <div
        className="
          space-y-4
        "
      >
        <GameHeader
          round={
            session.roundIndex
          }
          total={total}
          score={
            session.score
          }
        />

        <RoundBoard
          key={
            puzzle.id
          }
          puzzle={
            puzzle
          }
          seed={
            session.seed
          }
          onResolved={
            onResult
          }
          onNext={
            isLast
              ? onDone
              : onNext
          }
        />
      </div>
    </AppShell>
  );
}