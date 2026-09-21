import { useState } from "react";
import { GlobalHeader } from "./components/GlobalHeader";
import { SettingsPanel } from "./components/SettingsPanel";
import { useGame } from "./hooks/useGame";
import { AtlasScreen } from "./screens/AtlasScreen";
import { BattleScreen } from "./screens/BattleScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ModeSelectScreen } from "./screens/ModeSelectScreen";
import { ResultsScreen } from "./screens/ResultsScreen";

type Screen = "home" | "modes" | "battle" | "atlas" | "history" | "results";

export default function App() {
  const game = useGame();
  const [screen, setScreen] = useState<Screen>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const start = (mode: "campaign" | "daily" | "sudden") => { game.startRun(mode); setScreen("battle"); };
  const activeScreen = game.results ? "results" : screen;
  return <div className="app-shell"><GlobalHeader trophies={game.progress.trophies} onHome={() => { game.setResults(null); setScreen("home"); }} onSettings={() => setSettingsOpen(true)} /><main>{activeScreen === "home" && <HomeScreen progress={game.progress} onCampaign={() => start("campaign")} onModes={() => setScreen("modes")} onAtlas={() => setScreen("atlas")} onHistory={() => setScreen("history")} />}{activeScreen === "modes" && <ModeSelectScreen onSelect={start} onBack={() => setScreen("home")} />}{activeScreen === "battle" && game.run && <BattleScreen run={game.run} onPick={game.choose} onFinish={game.finish} />}{activeScreen === "atlas" && <AtlasScreen progress={game.progress} onBack={() => setScreen("home")} onBattle={() => start("campaign")} />}{activeScreen === "history" && <HistoryScreen progress={game.progress} onBack={() => setScreen("home")} />}{activeScreen === "results" && game.results && <ResultsScreen results={game.results} onHome={() => { game.setResults(null); setScreen("home"); }} onRetry={() => start(game.results!.summary.mode)} />}</main>{settingsOpen && <SettingsPanel settings={game.progress.settings} onChange={game.updateSettings} onClose={() => setSettingsOpen(false)} />}</div>;
}
