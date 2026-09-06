import {
  useEffect,
  useState,
} from "react";
import { AboutModal } from "./components/AboutModal";
import { Briefing } from "./components/Briefing";
import { GameScreen } from "./components/GameScreen";
import { Landing } from "./components/Landing";
import { Records } from "./components/Records";
import { Results } from "./components/Results";
import { UpgradePicker } from "./components/UpgradePicker";
import { useGame } from "./hooks/useGame";
import {
  loadRecords,
  personalBest,
  saveRun,
} from "./lib/storage";
import type { RunRecord } from "./types/game";

export default function App() {
  const game = useGame();

  const [about, setAbout] = useState(false);

  const [records, setRecords] =
    useState<RunRecord[]>(() => loadRecords());

  useEffect(() => {
    if (game.state.phase !== "results") {
      return;
    }

    setRecords(saveRun(game.state));
  }, [
    game.state.phase,
    game.state.runId,
  ]);

  const commonAbout = {
    onAbout: () => setAbout(true),
  };

  return (
    <>
      {game.state.phase === "landing" && (
        <Landing
          {...commonAbout}
          best={personalBest(records)}
          onStart={game.openBriefing}
          onRecords={game.records}
        />
      )}

      {game.state.phase === "briefing" && (
        <Briefing
          {...commonAbout}
          onStart={game.start}
        />
      )}

      {game.state.phase === "playing" && (
        <GameScreen
          {...commonAbout}
          state={game.state}
          onSelectDanfo={game.selectDanfo}
          onDispatch={game.dispatchTo}
          onHorn={game.horn}
          onPolice={game.payPolice}
          onBuy={game.buyDanfo}
          onPause={game.togglePause}
          onSpeed={game.setSpeed}
          onEnd={game.endRun}
        />
      )}

      {game.state.phase === "upgrade" && (
        <UpgradePicker
          {...commonAbout}
          state={game.state}
          onChoose={game.upgrade}
        />
      )}

      {game.state.phase === "results" && (
        <Results
          {...commonAbout}
          state={game.state}
          onAgain={game.openBriefing}
          onHome={game.home}
        />
      )}

      {game.state.phase === "records" && (
        <Records
          {...commonAbout}
          records={records}
          onBack={game.home}
        />
      )}

      <AboutModal
        open={about}
        onClose={() => setAbout(false)}
      />
    </>
  );
}