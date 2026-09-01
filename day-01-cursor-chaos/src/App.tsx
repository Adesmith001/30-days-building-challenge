import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AboutDialog } from "./components/AboutDialog";
import { BottomControls, DebugHud, StatusLine, Topbar } from "./components/Controls";
import { ChaosCanvas } from "./components/ChaosCanvas";
import { cycleMode, type CursorMode } from "./physics";
import type { WorldApi, WorldStats } from "./types";

function App() {
  const [mode, setMode] = useState<CursorMode>("stir");
  const [gravityOn, setGravityOn] = useState(true);
  const [debug, setDebug] = useState(false);
  const [about, setAbout] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const [stats, setStats] = useState<WorldStats>({ fps: 60, objects: 0 });
  const emptyApi = useMemo<WorldApi>(() => ({ reset: () => {}, spawn: () => {} }), []);
  const api = useRef<WorldApi>(emptyApi);
  const options = useMemo(() => ({ mode, gravityOn }), [mode, gravityOn]);

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
      if (event.key === "1") setMode("stir");
      if (event.key === "2") setMode("attract");
      if (event.key === "3") setMode("repel");
      if (event.key.toLowerCase() === "m") setMode((value) => cycleMode(value));
      if (event.key.toLowerCase() === "g") setGravityOn((value) => !value);
      if (event.key.toLowerCase() === "r") api.current.reset();
      if (event.key.toLowerCase() === "d") setDebug((value) => !value);
      if (event.code === "Space") {
        event.preventDefault();
        api.current.spawn();
      }
      if (event.key === "Escape") {
        setAbout(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="app">
      <ChaosCanvas options={options} onReady={handleReady} onStats={handleStats} />
      <Topbar
        onAbout={() => setAbout(true)}
        onReset={() => {
          setMode("stir");
          setGravityOn(true);
          api.current.reset();
        }}
      />

      <section className={`intro ${introHidden ? "is-hidden" : ""}`} aria-live="polite">
        <h2>MOVE YOUR CURSOR</h2>
        <p>The world will notice.</p>
      </section>

      <BottomControls
        api={api.current}
        mode={mode}
        gravityOn={gravityOn}
        stats={stats}
        onMode={setMode}
        onGravity={() => setGravityOn((value) => !value)}
        onReset={() => {
          setMode("stir");
          setGravityOn(true);
          api.current.reset();
        }}
      />

      {debug && <DebugHud mode={mode} gravityOn={gravityOn} stats={stats} />}
      <StatusLine stats={stats} />
      {about && <AboutDialog onClose={() => setAbout(false)} />}
    </main>
  );
}

export { App };
