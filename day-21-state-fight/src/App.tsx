import { useCallback, useEffect, useState } from "react";
import { GlobalHeader } from "./components/GlobalHeader";
import { SettingsPanel } from "./components/SettingsPanel";
import { useGame } from "./hooks/useGame";
import { AtlasScreen } from "./screens/AtlasScreen";
import { BattleScreen } from "./screens/BattleScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ModeSelectScreen } from "./screens/ModeSelectScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { pathForScreen, resolveActiveScreen, screenFromPath, type Screen } from "./lib/routes";

export default function App() {
  const game = useGame();
  const [screen, setScreen] = useState<Screen>(() => screenFromPath(window.location.pathname));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useCallback((next: Screen, replace = false) => {
    window.history[replace ? "replaceState" : "pushState"]({}, "", pathForScreen(next));
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onPopState = () => setScreen(screenFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const activeScreen = resolveActiveScreen(screen, Boolean(game.run), Boolean(game.results));

  useEffect(() => {
    // Results can be produced inside the game hook (including sudden-death runs), so sync that state to the URL here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeScreen !== screen) navigate(activeScreen, activeScreen === "home");
  }, [activeScreen, navigate, screen]);

  useEffect(() => {
    window.render_game_to_text = () => JSON.stringify({
      screen: activeScreen,
      route: window.location.pathname,
      trophies: game.progress.trophies,
      run: game.run ? {
        mode: game.run.mode,
        round: Math.min(game.run.index + 1, game.run.deck.length),
        totalRounds: game.run.deck.length,
        score: game.run.score,
        streak: game.run.streak,
      } : null,
    });
    return () => { delete window.render_game_to_text; };
  }, [activeScreen, game.progress.trophies, game.run]);

  const start = (mode: "campaign" | "daily" | "sudden") => {
    game.startRun(mode);
    navigate("battle");
  };
  const goHome = () => {
    game.setResults(null);
    navigate("home");
  };

  return (
    <div className="app-shell">
      <GlobalHeader trophies={game.progress.trophies} onHome={goHome} onSettings={() => setSettingsOpen(true)} />
      <main>
        {activeScreen === "home" && <HomeScreen progress={game.progress} onCampaign={() => start("campaign")} onModes={() => navigate("modes")} onAtlas={() => navigate("atlas")} onHistory={() => navigate("history")} />}
        {activeScreen === "modes" && <ModeSelectScreen onSelect={start} onBack={goHome} />}
        {activeScreen === "battle" && game.run && <BattleScreen run={game.run} onPick={game.choose} onFinish={game.finish} />}
        {activeScreen === "atlas" && <AtlasScreen progress={game.progress} onBack={goHome} onBattle={() => start("campaign")} />}
        {activeScreen === "history" && <HistoryScreen progress={game.progress} onBack={goHome} />}
        {activeScreen === "results" && game.results && <ResultsScreen results={game.results} onHome={goHome} onRetry={() => start(game.results!.summary.mode)} />}
      </main>
      {settingsOpen && <SettingsPanel settings={game.progress.settings} onChange={game.updateSettings} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
