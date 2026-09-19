import {
  useEffect,
  useState,
} from "react";

import {
  useGameSession,
} from "./hooks/useGameSession";

import {
  hasSeenTutorial,
} from "./lib/storage";

import {
  pathToScreen,
  screenToPath,
} from "./lib/routes";

import type {
  Screen,
} from "./lib/routes";

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

type NavigationTarget =
  | Screen
  | "daily";

export default function App() {
  const [
    screen,
    setScreen,
  ] = useState<Screen>(() =>
    pathToScreen(
      window.location.pathname,
    ),
  );

  const game =
    useGameSession();

  const navigate = (
    target: NavigationTarget,
  ) => {
    if (
      target ===
      "daily"
    ) {
      window.history.pushState(
        {},
        "",
        "/daily",
      );
      game.start("daily");
      setScreen("game");
      return;
    }

    window.history.pushState(
      {},
      "",
      screenToPath(target),
    );
    setScreen(target);
  };

  useEffect(() => {
    const syncRoute = () => {
      const target =
        pathToScreen(
          window.location.pathname,
        );

      if (
        target ===
        "daily"
      ) {
        game.start("daily");
        setScreen("game");
        return;
      }

      if (
        (target === "game" ||
          target === "results") &&
        !game.session
      ) {
        window.history.replaceState(
          {},
          "",
          screenToPath("home"),
        );
        setScreen("home");
        return;
      }

      setScreen(target);
    };

    window.addEventListener(
      "popstate",
      syncRoute,
    );

    if (
      pathToScreen(
        window.location.pathname,
      ) === "daily"
    ) {
      syncRoute();
    }

    return () =>
      window.removeEventListener(
        "popstate",
        syncRoute,
      );
  }, []);

  const startNormal = () => {
    if (
      !hasSeenTutorial()
    ) {
      navigate(
        "tutorial",
      );

      return;
    }

    game.start(
      "normal",
    );

    navigate(
      "game",
    );
  };

  const startDaily = () =>
    navigate("daily");

  const startCategory = (
    category:
      PuzzleCategory,
  ) => {
    game.start(
      "category",
      category,
    );

    navigate(
      "game",
    );
  };

  if (
    screen ===
    "tutorial"
  ) {
    return (
      <TutorialScreen
        onHome={() =>
          navigate(
            "home",
          )
        }
        onDone={() => {
          game.start(
            "normal",
          );

          navigate(
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
          navigate(
            "results",
          )
        }
        onHome={() =>
          navigate(
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

      navigate(
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
          navigate(
            "home",
          )
        }
        onHistory={() =>
          navigate(
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
          navigate(
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
          navigate(
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
          navigate(
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
          navigate(
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
        navigate(
          "tutorial",
        )
      }
      onCategories={() =>
        navigate(
          "categories",
        )
      }
      onBlind={() =>
        navigate(
          "blind",
        )
      }
      onGap={() =>
        navigate(
          "gap",
        )
      }
      onHistory={() =>
        navigate(
          "history",
        )
      }
      onNavigate={
        navigate
      }
    />
  );
}
