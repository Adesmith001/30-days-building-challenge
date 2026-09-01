import { MAX_OBJECTS } from "../constants";
import { gravityLabel, type GravityState, type WindState } from "../physics";
import type { WorldApi, WorldStats } from "../types";

function windLabel(wind: WindState) {
  if (wind === "right") return "RIGHT";
  if (wind === "left") return "LEFT";
  if (wind === "up") return "UPDRAFT";
  return "CALM";
}

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
  gravity,
  wind,
  zeroG,
  stats,
  onGravity,
  onWind,
  onZeroG,
  onClean,
}: {
  api: WorldApi;
  gravity: GravityState;
  wind: WindState;
  zeroG: boolean;
  stats: WorldStats;
  onGravity: () => void;
  onWind: () => void;
  onZeroG: () => void;
  onClean: () => void;
}) {
  return (
    <div className="bottombar">
      <button type="button" onClick={onGravity}>GRAVITY: {gravityLabel(gravity)}</button>
      <button type="button" onClick={onWind}>WIND: {windLabel(wind)}</button>
      <button type="button" className={zeroG ? "active" : ""} onClick={onZeroG}>ZERO-G</button>
      <button type="button" onClick={api.spawn} disabled={stats.objects >= MAX_OBJECTS}>+ OBJECT</button>
      <button type="button" onClick={api.pulse}>PULSE</button>
      <button type="button" onClick={onClean}>CLEAN</button>
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
  gravity,
  wind,
  zeroG,
  stats,
}: {
  gravity: GravityState;
  wind: WindState;
  zeroG: boolean;
  stats: WorldStats;
}) {
  return (
    <div className="debug-hud">
      <span>OBJECTS {stats.objects}</span>
      <span>FPS {stats.fps}</span>
      <span>GRAVITY {zeroG ? "ZERO-G" : gravityLabel(gravity)}</span>
      <span>WIND {windLabel(wind)}</span>
    </div>
  );
}
