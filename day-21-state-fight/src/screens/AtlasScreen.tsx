import { STATES } from "../data/states";
import type { ProgressData } from "../types/game";

export function AtlasScreen({ progress, onBack, onBattle }: { progress: ProgressData; onBack: () => void; onBattle: () => void }) {
  return <section className="screen"><button className="back-button" onClick={onBack}>← BASE</button><p className="eyebrow">INTELLIGENCE ARCHIVE</p><h1>STATE ATLAS</h1><p className="lede">Win a battle to discover a stronghold and unlock its field record.</p><div className="atlas-grid">{STATES.map((state) => { const discovered = progress.discovered.includes(state.id); return <article className={discovered ? "discovered" : "locked-state"} key={state.id}><strong>{discovered ? state.name : "CLASSIFIED"}</strong><span>{discovered ? `${state.capital} · ${state.zone}` : "Win battles to reveal"}</span></article>; })}</div><button className="primary-button" onClick={onBattle}>SEND IT TO BATTLE</button></section>;
}
