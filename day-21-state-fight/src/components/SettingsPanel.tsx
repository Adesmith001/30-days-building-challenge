import type { Settings } from "../types/game";

export function SettingsPanel({ settings, onChange, onClose }: { settings: Settings; onChange: (settings: Settings) => void; onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="settings-panel" role="dialog" aria-modal="true" aria-label="Settings" onClick={(event) => event.stopPropagation()}><p className="eyebrow">ARENA SETTINGS</p><h2>COMMAND OPTIONS</h2>{(["sound", "fastBattles"] as const).map((key) => <label key={key}><span>{key === "sound" ? "SOUND EFFECTS" : "FAST BATTLES"}</span><input type="checkbox" checked={settings[key]} onChange={() => onChange({ ...settings, [key]: !settings[key] })} /></label>)}<button className="secondary-button" onClick={onClose}>DONE</button></section></div>;
}
