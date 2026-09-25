import { AboutPanel } from "./components/AboutPanel";
import { BenchmarkPanel } from "./components/BenchmarkPanel";
import { BottomDock } from "./components/BottomDock";
import { CalibrationOverlay } from "./components/CalibrationOverlay";
import { EngineLab } from "./components/EngineLab";
import { EnginePanel } from "./components/EnginePanel";
import { Hud } from "./components/Hud";
import { Landing } from "./components/Landing";
import { MissionPanel } from "./components/MissionPanel";
import { MorePanel } from "./components/MorePanel";
import { NaiveWarning } from "./components/NaiveWarning";
import { PhotoMode } from "./components/PhotoMode";
import { ShareModal } from "./components/ShareModal";
import { TopBar } from "./components/TopBar";
import { useAudio } from "./hooks/useAudio";
import { useKeyboard } from "./hooks/useKeyboard";
import { useReplay } from "./hooks/useReplay";
import { useSimulationWorker } from "./hooks/useSimulationWorker";
import { useTour } from "./hooks/useTour";
import { useSimulationStore } from "./store/useSimulationStore";
import { CityCanvas } from "./three/CityCanvas";

export default function App() {
  useSimulationWorker();
  useKeyboard();
  useReplay();
  useTour();
  useAudio();

  const screen = useSimulationStore(
    (state) => state.screen,
  );

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#0b0c0b] text-[#f6f3e6]">
      <CityCanvas />

      {screen === "landing" && <Landing />}

      <CalibrationOverlay />

      {screen === "city" && (
        <>
          <TopBar />
          <Hud />
          <BottomDock />

          <EnginePanel />
          <EngineLab />
          <BenchmarkPanel />
          <MissionPanel />
          <MorePanel />
          <AboutPanel />

          <NaiveWarning />
          <ShareModal />
          <PhotoMode />
        </>
      )}

      {screen !== "city" && <AboutPanel />}
    </main>
  );
}
