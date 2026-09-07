import { useState } from "react";
import { Header } from "./components/Header";
import { SiteFooter } from "./components/SiteFooter";
import { useRecords } from "./hooks/useRecords";
import {
  getTutorialComplete,
  saveTutorialComplete,
} from "./lib/storage";
import { AboutScreen } from "./screens/AboutScreen";
import { GameScreen } from "./screens/GameScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { RecordsScreen } from "./screens/RecordsScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { TutorialScreen } from "./screens/TutorialScreen";
import type { RoundResult } from "./types/game";

type Screen =
  | "home"
  | "tutorial"
  | "game"
  | "results"
  | "records"
  | "about";

export default function App() {
  const [screen, setScreen] =
    useState<Screen>("home");

  const [tutorialDone, setTutorialDone] =
    useState(getTutorialComplete);

  const [gameKey, setGameKey] = useState(0);

  const [lastResults, setLastResults] =
    useState<RoundResult[]>([]);

  const { records, recordRun } = useRecords();

  function startGame() {
    setGameKey((current) => current + 1);
    setScreen("game");
  }

  function requestGame() {
    if (tutorialDone) {
      startGame();
      return;
    }

    setScreen("tutorial");
  }

  function finishTutorial() {
    saveTutorialComplete();
    setTutorialDone(true);
    startGame();
  }

  function finishGame(results: RoundResult[]) {
    setLastResults(results);
    recordRun(results);
    setScreen("results");
  }

  return (
    <div
      className="
        min-h-screen bg-[#faf8f4]
        [background-image:radial-gradient(#d8ddd7_0.8px,transparent_0.8px)]
        [background-size:20px_20px]
        text-[#171717]
      "
    >
      <Header
        onHome={() => setScreen("home")}
        onAbout={() => setScreen("about")}
      />

      {screen === "home" && (
        <HomeScreen
          records={records}
          onStart={requestGame}
          onRecords={() => setScreen("records")}
        />
      )}

      {screen === "tutorial" && (
        <TutorialScreen
          onComplete={finishTutorial}
          onExit={() => setScreen("home")}
        />
      )}

      {screen === "game" && (
        <GameScreen
          key={gameKey}
          onComplete={finishGame}
        />
      )}

      {screen === "results" && (
        <ResultsScreen
          results={lastResults}
          onReplay={startGame}
          onRecords={() => setScreen("records")}
        />
      )}

      {screen === "records" && (
        <RecordsScreen
          records={records}
          onPlay={requestGame}
        />
      )}

      {screen === "about" && (
        <AboutScreen
          onPlay={requestGame}
          onTutorial={() => setScreen("tutorial")}
          onRecords={() => setScreen("records")}
        />
      )}

      <SiteFooter />
    </div>
  );
}