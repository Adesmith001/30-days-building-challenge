import { useEffect, useMemo, useState } from "react";

import { Header } from "./components/Header";
import { HowToPlay } from "./components/HowToPlay";
import { StatsPanel } from "./components/StatsPanel";
import { getDailyWord, getRandomWord, getUtcDateKey } from "./lib/daily";
import { loadStats } from "./lib/storage";
import { GameScreen } from "./screens/GameScreen";
import { HomeScreen } from "./screens/HomeScreen";
import type { GameMode, SabiWord } from "./types/game";

type Screen = "home" | "game";

function routeFromPath(pathname: string): { screen: Screen; mode: GameMode } {
  if (pathname === "/game/daily") return { screen: "game", mode: "daily" };
  if (pathname === "/game/run") return { screen: "game", mode: "run" };
  return { screen: "home", mode: "run" };
}

export default function App() {
  const dateKey = useMemo(() => getUtcDateKey(), []);
  const initialRoute = useMemo(
    () => routeFromPath(window.location.pathname),
    [],
  );
  const [screen, setScreen] = useState<Screen>(initialRoute.screen);
  const [mode, setMode] = useState<GameMode>(initialRoute.mode);
  const [entry, setEntry] = useState<SabiWord>(() =>
    initialRoute.mode === "daily" ? getDailyWord(dateKey) : getRandomWord(),
  );
  const [gameKey, setGameKey] = useState(0);
  const [stats, setStats] = useState(loadStats);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const dailyPlayed = stats.history.some(
    (item) => item.mode === "daily" && item.date === dateKey,
  );

  useEffect(() => {
    function handlePopState() {
      const route = routeFromPath(window.location.pathname);
      setScreen(route.screen);
      setMode(route.mode);

      if (route.screen === "game") {
        setEntry(
          route.mode === "daily"
            ? getDailyWord(dateKey)
            : getRandomWord(),
        );
        setGameKey((value) => value + 1);
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [dateKey]);

  function navigate(path: string) {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
  }

  function refreshStats() {
    setStats(loadStats());
  }

  function goHome() {
    navigate("/");
    setScreen("home");
  }

  function startGame(nextMode: GameMode) {
    if (nextMode === "daily" && dailyPlayed) return;

    window.scrollTo(0, 0);
    setMode(nextMode);
    setEntry(
      nextMode === "daily" ? getDailyWord(dateKey) : getRandomWord(),
    );
    setGameKey((value) => value + 1);
    navigate(`/game/${nextMode}`);
    setScreen("game");
  }

  function nextRun() {
    setEntry((current) => getRandomWord(current.answer));
    setGameKey((value) => value + 1);
  }

  return (
    <div className="min-h-dvh bg-[#fbf7f2] text-[#171513]">
      <div className="flex min-h-dvh flex-col">
        <Header
          onHome={goHome}
          onHowTo={() => setShowHowTo(true)}
          onStats={() => setShowStats(true)}
        />

        {screen === "home" ? (
          <HomeScreen
            stats={stats}
            dailyPlayed={dailyPlayed}
            dateKey={dateKey}
            onStart={startGame}
          />
        ) : (
          <GameScreen
            key={gameKey}
            entry={entry}
            mode={mode}
            dateKey={dateKey}
            onHome={goHome}
            onNext={nextRun}
            onStatsChange={refreshStats}
          />
        )}

        <footer className="mx-auto w-full max-w-7xl px-4 pb-6 pt-2 sm:px-8">
          <p className="border-t border-[#d9d2c8] pt-4 font-mono text-[9px] tracking-[0.14em] text-[#8a837a]">
            MADE FOR THE ONES WEY DEY SABI.
          </p>
        </footer>
      </div>

      {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
      {showStats && (
        <StatsPanel stats={stats} onClose={() => setShowStats(false)} />
      )}
    </div>
  );
}
