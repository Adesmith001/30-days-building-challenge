import type { RunMode } from "../types/game";

export function ModeSelectScreen({ onSelect, onBack }: { onSelect: (mode: RunMode) => void; onBack: () => void }) {
  const modes: Array<[RunMode, string, string]> = [["campaign", "CAMPAIGN", "Ten battles. Final siege at round ten."], ["daily", "DAILY RAID", "Five seeded battles shared by everyone today."], ["sudden", "LAST STRONGHOLD", "Keep fighting until your first miss."]];
  return <section className="screen"><button className="back-button" onClick={onBack}>← BASE</button><p className="eyebrow">SELECT OPERATION</p><h1>BATTLE MODES</h1><div className="mode-list">{modes.map(([id, name, detail]) => <button className="mode-card" key={id} onClick={() => onSelect(id)}><strong>{name}</strong><span>{detail}</span><i>DEPLOY →</i></button>)}</div></section>;
}
