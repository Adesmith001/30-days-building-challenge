import { useEffect, useState } from "react";
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
  useEffect(() => { if (game.results) setScreen("results"); }, [game.results]);
  const start = (mode: "campaign" | "daily" | "sudden") => { game.startRun(mode); setScreen("battle"); };
  return <div className="app-shell"><GlobalHeader trophies={game.progress.trophies} onHome={() => setScreen("home")} onSettings={() => setSettingsOpen(true)} /><main>{screen === "home" && <HomeScreen progress={game.progress} onCampaign={() => start("campaign")} onModes={() => setScreen("modes")} onAtlas={() => setScreen("atlas")} onHistory={() => setScreen("history")} />}{screen === "modes" && <ModeSelectScreen onSelect={start} onBack={() => setScreen("home")} />}{screen === "battle" && game.run && <BattleScreen run={game.run} onPick={game.choose} onFinish={game.finish} />}{screen === "atlas" && <AtlasScreen progress={game.progress} onBack={() => setScreen("home")} onBattle={() => start("campaign")} />}{screen === "history" && <HistoryScreen progress={game.progress} onBack={() => setScreen("home")} />}{screen === "results" && game.results && <ResultsScreen results={game.results} onHome={() => setScreen("home")} onRetry={() => start(game.results!.summary.mode)} />}</main>{settingsOpen && <SettingsPanel settings={game.progress.settings} onChange={game.updateSettings} onClose={() => setSettingsOpen(false)} />}</div>;
}
