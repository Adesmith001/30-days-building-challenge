import {
  useState,
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

import type {
  ComparisonDraft,
  ComparisonPrefs,
  SavedComparison,
} from "./types/comparison";

type Screen =
  | "landing"
  | "routine"
  | "homeA"
  | "homeB"
  | "compare"
  | "history"
  | "about";

export default function App() {
  const [
    screen,
    setScreen,
  ] = useState<Screen>(
    "landing",
  );

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

    setScreen(
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

    setScreen(
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

    setScreen(
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
          setScreen(
            "landing",
          )
        }
        onHistory={() =>
          setScreen(
            "history",
          )
        }
        onAbout={() =>
          setScreen(
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

            setScreen(
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
            setScreen(
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

            setScreen(
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
            setScreen(
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