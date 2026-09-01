import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AboutDialog } from "./components/AboutDialog";
import { BottomControls, DebugHud, StatusLine, Topbar } from "./components/Controls";
import { ChaosCanvas } from "./components/ChaosCanvas";
import { cycleGravity, cycleWind, type GravityState, type WindState } from "./physics";
import type { WorldApi, WorldStats } from "./types";

function App() {
  const [gravity, setGravity] = useState<GravityState>("down");
  const [wind, setWind] = useState<WindState>("calm");
  const [zeroG, setZeroG] = useState(false);
  const [debug, setDebug] = useState(false);
  const [clean, setClean] = useState(false);
  const [about, setAbout] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const [stats, setStats] = useState<WorldStats>({ fps: 60, objects: 0 });
  const emptyApi = useMemo<WorldApi>(() => ({ reset: () => {}, spawn: () => {}, pulse: () => {} }), []);
  const api = useRef<WorldApi>(emptyApi);
  const options = useMemo(() => ({ gravity, zeroG, wind }), [gravity, zeroG, wind]);

  const handleReady = useCallback((nextApi: WorldApi) => {
    api.current = nextApi;
  }, []);

  const handleStats = useCallback((nextStats: WorldStats) => {
    setStats(nextStats);
  }, []);

  useEffect(() => {
    const onMove = () => setIntroHidden(true);
    window.addEventListener("pointermove", onMove, { once: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "g") setGravity((value) => cycleGravity(value));
      if (event.key.toLowerCase() === "w") setWind((value) => cycleWind(value));
      if (event.key.toLowerCase() === "z") setZeroG((value) => !value);
      if (event.key.toLowerCase() === "p") api.current.pulse();
      if (event.key.toLowerCase() === "r") api.current.reset();
      if (event.key.toLowerCase() === "d") setDebug((value) => !value);
      if (event.code === "Space") {
        event.preventDefault();
        api.current.spawn();
      }
      if (event.key === "Escape") {
        setClean(false);
        setAbout(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className={`app ${clean ? "is-clean" : ""}`}>
      <ChaosCanvas options={options} onReady={handleReady} onStats={handleStats} />
      <Topbar onAbout={() => setAbout(true)} onReset={() => api.current.reset()} />

      <section className={`intro ${introHidden ? "is-hidden" : ""}`} aria-live="polite">
        <h2>MOVE YOUR CURSOR</h2>
        <p>The world will notice.</p>
      </section>

      <BottomControls
        api={api.current}
        gravity={gravity}
        wind={wind}
        zeroG={zeroG}
        stats={stats}
        onGravity={() => setGravity((value) => cycleGravity(value))}
        onWind={() => setWind((value) => cycleWind(value))}
        onZeroG={() => setZeroG((value) => !value)}
        onClean={() => setClean(true)}
      />

      {debug && <DebugHud gravity={gravity} wind={wind} zeroG={zeroG} stats={stats} />}
      <StatusLine stats={stats} />
      {about && <AboutDialog onClose={() => setAbout(false)} />}
    </main>
  );
}

export { App };
