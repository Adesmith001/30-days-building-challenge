import {
  useState,
  useEffect,
} from "react";

import AppHeader from "./components/AppHeader";
import GameToast from "./components/GameToast";

import {
  useGame,
} from "./hooks/useGame";

import {
  useHistory,
} from "./hooks/useHistory";

import {
  defaultPrefs,
  demoDraft,
  emptyDraft,
} from "./lib/defaults";

import AboutScreen from "./screens/AboutScreen";
import CompareScreen from "./screens/CompareScreen";
import HistoryScreen from "./screens/HistoryScreen";
import HomeScreen from "./screens/HomeScreen";
import LandingScreen from "./screens/LandingScreen";
import RoutineScreen from "./screens/RoutineScreen";

import {
  pathToScreen,
  screenToPath,
} from "./lib/routes";

import type {
  ComparisonDraft,
  ComparisonPrefs,
  SavedComparison,
} from "./types/comparison";

import type { Screen } from "./lib/routes";

export default function App() {
  const [
    screen,
    setScreen,
  ] = useState<Screen>(
    () => pathToScreen(window.location.pathname),
  );

  const navigate = (next: Screen) => {
    window.history.pushState({}, "", screenToPath(next));
    setScreen(next);
  };

  useEffect(() => {
    const onPopState = () =>
      setScreen(pathToScreen(window.location.pathname));

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const [
    draft,
    setDraft,
  ] = useState<ComparisonDraft>(
    emptyDraft,
  );

  const [
    prefs,
    setPrefs,
  ] = useState<ComparisonPrefs>(
    defaultPrefs,
  );

  const {
    items,
    save,
    remove,
  } = useHistory();

  const game =
    useGame();

  const start = () => {
    setDraft(
      emptyDraft,
    );

    setPrefs(
      defaultPrefs,
    );

    navigate(
      "routine",
    );
  };

  const runDemo = () => {
    setDraft(
      demoDraft,
    );

    setPrefs(
      defaultPrefs,
    );

    game.unlock(
      "routine",
    );

    game.unlock(
      "homes",
    );

    navigate(
      "compare",
    );
  };

  const openSaved = (
    item: SavedComparison,
  ) => {
    setDraft(
      item.draft,
    );

    setPrefs(
      item.prefs,
    );

    navigate(
      "compare",
    );
  };

  return (
    <div
      className="
        min-h-screen
        bg-paper
        text-ink
      "
    >
      <AppHeader
        xp={game.xp}
        onHome={() =>
          navigate(
            "landing",
          )
        }
        onHistory={() =>
          navigate(
            "history",
          )
        }
        onAbout={() =>
          navigate(
            "about",
          )
        }
      />

      {screen ===
        "landing" && (
        <LandingScreen
          onStart={start}
          onDemo={runDemo}
        />
      )}

      {screen ===
        "routine" && (
        <RoutineScreen
          routine={
            draft.routine
          }
          onChange={(
            routine,
          ) =>
            setDraft({
              ...draft,
              routine,
            })
          }
          onNext={() => {
            game.unlock(
              "routine",
            );

            navigate(
              "homeA",
            );
          }}
        />
      )}

      {screen ===
        "homeA" && (
        <HomeScreen
          home={
            draft.homeA
          }
          onChange={(
            homeA,
          ) =>
            setDraft({
              ...draft,
              homeA,
            })
          }
          onNext={() =>
            navigate(
              "homeB",
            )
          }
        />
      )}

      {screen ===
        "homeB" && (
        <HomeScreen
          home={
            draft.homeB
          }
          onChange={(
            homeB,
          ) =>
            setDraft({
              ...draft,
              homeB,
            })
          }
          onNext={() => {
            game.unlock(
              "homes",
            );

            navigate(
              "compare",
            );
          }}
        />
      )}

      {screen ===
        "compare" && (
        <CompareScreen
          key={
            `${draft.homeA.name}-${draft.homeB.name}`
          }
          baseDraft={
            draft
          }
          prefs={
            prefs
          }
          onPrefsChange={
            setPrefs
          }
          onEdit={() =>
            navigate(
              "routine",
            )
          }
          onSave={
            save
          }
          onUnlock={
            game.unlock
          }
        />
      )}

      {screen ===
        "history" && (
        <HistoryScreen
          items={
            items
          }
          onOpen={
            openSaved
          }
          onRemove={
            remove
          }
        />
      )}

      {screen ===
        "about" && (
        <AboutScreen />
      )}

      <GameToast
        message={
          game.toast
        }
      />
    </div>
  );
}
