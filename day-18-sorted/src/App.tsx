import {
  useState,
} from "react";

import {
  useGameSession,
} from "./hooks/useGameSession";

import {
  hasSeenTutorial,
} from "./lib/storage";

import type {
  PuzzleCategory,
} from "./types/game";

import {
  BlindSortScreen,
} from "./screens/BlindSortScreen";

import {
  CategoryScreen,
} from "./screens/CategoryScreen";

import {
  GameScreen,
} from "./screens/GameScreen";

import {
  GapSortScreen,
} from "./screens/GapSortScreen";

import {
  HistoryScreen,
} from "./screens/HistoryScreen";

import {
  HomeScreen,
} from "./screens/HomeScreen";

import {
  ResultsScreen,
} from "./screens/ResultsScreen";

import {
  TutorialScreen,
} from "./screens/TutorialScreen";

type Screen =
  | "home"
  | "tutorial"
  | "game"
  | "results"
  | "history"
  | "categories"
  | "blind"
  | "gap";

export default function App() {
  const [
    screen,
    setScreen,
  ] =
    useState<Screen>(
      "home",
    );

  const game =
    useGameSession();

  const startNormal = () => {
    if (
      !hasSeenTutorial()
    ) {
      setScreen(
        "tutorial",
      );

      return;
    }

    game.start(
      "normal",
    );

    setScreen(
      "game",
    );
  };

  const startDaily = () => {
    game.start(
      "daily",
    );

    setScreen(
      "game",
    );
  };

  const startCategory = (
    category:
      PuzzleCategory,
  ) => {
    game.start(
      "category",
      category,
    );

    setScreen(
      "game",
    );
  };

  const navigate = (
    target:
      | "home"
      | "daily"
      | "history",
  ) => {
    if (
      target ===
      "daily"
    ) {
      startDaily();
    } else {
      setScreen(
        target,
      );
    }
  };

  if (
    screen ===
    "tutorial"
  ) {
    return (
      <TutorialScreen
        onHome={() =>
          setScreen(
            "home",
          )
        }
        onDone={() => {
          game.start(
            "normal",
          );

          setScreen(
            "game",
          );
        }}
      />
    );
  }

  if (
    screen === "game" &&
    game.session
  ) {
    return (
      <GameScreen
        session={
          game.session
        }
        onResult={
          game.addResult
        }
        onNext={
          game.nextRound
        }
        onDone={() =>
          setScreen(
            "results",
          )
        }
        onHome={() =>
          setScreen(
            "home",
          )
        }
      />
    );
  }

  if (
    screen ===
      "results" &&
    game.session
  ) {
    const replay = () => {
      game.start(
        game.session!.mode,
        game.session!
          .category,
      );

      setScreen(
        "game",
      );
    };

    return (
      <ResultsScreen
        session={
          game.session
        }
        onAgain={
          replay
        }
        onHome={() =>
          setScreen(
            "home",
          )
        }
        onHistory={() =>
          setScreen(
            "history",
          )
        }
      />
    );
  }

  if (
    screen ===
    "history"
  ) {
    return (
      <HistoryScreen
        onHome={() =>
          setScreen(
            "home",
          )
        }
        onNavigate={
          navigate
        }
      />
    );
  }

  if (
    screen ===
    "categories"
  ) {
    return (
      <CategoryScreen
        onPick={
          startCategory
        }
        onHome={() =>
          setScreen(
            "home",
          )
        }
      />
    );
  }

  if (
    screen ===
    "blind"
  ) {
    return (
      <BlindSortScreen
        onHome={() =>
          setScreen(
            "home",
          )
        }
      />
    );
  }

  if (
    screen ===
    "gap"
  ) {
    return (
      <GapSortScreen
        onHome={() =>
          setScreen(
            "home",
          )
        }
      />
    );
  }

  return (
    <HomeScreen
      onStart={
        startNormal
      }
      onDaily={
        startDaily
      }
      onTutorial={() =>
        setScreen(
          "tutorial",
        )
      }
      onCategories={() =>
        setScreen(
          "categories",
        )
      }
      onBlind={() =>
        setScreen(
          "blind",
        )
      }
      onGap={() =>
        setScreen(
          "gap",
        )
      }
      onHistory={() =>
        setScreen(
          "history",
        )
      }
      onNavigate={
        navigate
      }
    />
  );
}