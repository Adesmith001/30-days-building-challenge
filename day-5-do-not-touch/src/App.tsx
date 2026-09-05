import { useEffect, useRef } from "react";
import { useGameSession } from "./hooks/useGameSession";
import { usePersonalBest } from "./hooks/usePersonalBest";
import { BossEnding } from "./components/BossEnding";
import { GameScreen } from "./components/GameScreen";
import { IntroScreen } from "./components/IntroScreen";
import { LevelComplete } from "./components/LevelComplete";
import { LevelIntro } from "./components/LevelIntro";
import { ResultsScreen } from "./components/ResultsScreen";

export default function App() {
  const game = useGameSession();
  const personalBest = usePersonalBest();

  const runSaved = useRef(false);

  useEffect(() => {
    if (game.phase !== "results") {
      runSaved.current = false;
      return;
    }

    if (runSaved.current) return;

    runSaved.current = true;
    personalBest.saveRun(game.stats);
  }, [
    game.phase,
    game.stats,
    personalBest,
  ]);

  if (game.phase === "intro") {
    return (
      <IntroScreen onStart={game.startGame} />
    );
  }

  if (game.phase === "level-intro") {
    return (
      <LevelIntro
        level={game.level}
        onStart={game.beginLevel}
        onReset={game.reset}
      />
    );
  }

  if (game.phase === "playing") {
    return (
      <GameScreen
        level={game.level}
        score={game.score}
        streak={game.streak}
        bossHits={game.bossHits}
        onMiss={game.registerMiss}
        onCatch={game.catchButton}
        onReset={game.reset}
      />
    );
  }

  if (
    game.phase === "level-complete" &&
    game.lastCatch
  ) {
    return (
      <LevelComplete
        level={game.level}
        summary={game.lastCatch}
        score={game.score}
        onNext={game.advanceLevel}
        onReset={game.reset}
      />
    );
  }

  if (game.phase === "boss-ending") {
    return (
      <BossEnding onDone={game.showResults} />
    );
  }

  return (
    <ResultsScreen
      stats={game.stats}
      best={personalBest.best}
      newBest={personalBest.lastUpdates.includes("score")}
      onReplay={game.startGame}
      onReset={game.reset}
    />
  );
}