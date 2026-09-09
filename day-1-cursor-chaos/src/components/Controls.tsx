import { MAX_OBJECTS } from "../constants";
import { gravityLabel, type CursorMode } from "../physics";
import type { WorldApi, WorldStats } from "../types";

const modes: CursorMode[] = ["stir", "attract", "repel"];

export function Topbar({ onAbout, onReset }: { onAbout: () => void; onReset: () => void }) {
  return (
    <header className="topbar">
      <div className="day">DAY 01/30</div>
      <h1>Cursor Chaos</h1>
      <nav>
        <button type="button" onClick={onReset}>RESET</button>
        <button type="button" onClick={onAbout}>ABOUT</button>
        <a href="https://github.com/Adesmith001" target="_blank" rel="noreferrer">GITHUB</a>
      </nav>
    </header>
  );
}

export function BottomControls({
  api,
  mode,
  gravityOn,
  stats,
  onMode,
  onGravity,
  onReset,
}: {
  api: WorldApi;
  mode: CursorMode;
  gravityOn: boolean;
  stats: WorldStats;
  onMode: (mode: CursorMode) => void;
  onGravity: () => void;
  onReset: () => void;
}) {
  return (
    <div className="bottombar">
      {modes.map((item) => (
        <button key={item} type="button" className={mode === item ? "active" : ""} onClick={() => onMode(item)} aria-pressed={mode === item}>
          {item.toUpperCase()}
        </button>
      ))}
      <button type="button" className={!gravityOn ? "active" : ""} onClick={onGravity} aria-pressed={!gravityOn}>
        GRAVITY {gravityLabel(gravityOn)}
      </button>
      <button type="button" onClick={api.spawn} disabled={stats.objects >= MAX_OBJECTS}>+ OBJECT</button>
      <button type="button" onClick={onReset}>RESET</button>
    </div>
  );
}

export function StatusLine({ stats }: { stats: WorldStats }) {
  return (
    <footer className="status-line">
      <span>STABLE_BUILD</span>
      <span>SYSTEM_LOG</span>
      <span>FPS: {stats.fps} | ENTITIES: {stats.objects}</span>
    </footer>
  );
}

export function DebugHud({
  mode,
  gravityOn,
  stats,
}: {
  mode: CursorMode;
  gravityOn: boolean;
  stats: WorldStats;
}) {
  return (
    <div className="debug-hud">
      <span>OBJECTS {stats.objects}</span>
      <span>FPS {stats.fps}</span>
      <span>MODE {mode.toUpperCase()}</span>
      <span>GRAVITY {gravityLabel(gravityOn)}</span>
    </div>
  );
}
