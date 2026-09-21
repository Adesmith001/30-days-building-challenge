import type { StateData } from "../types/game";

export function Stronghold({ state, selected, disabled, onPick }: { state: StateData; selected?: boolean; disabled?: boolean; onPick: () => void }) {
  return <button className={`stronghold ${selected ? "selected" : ""}`} disabled={disabled} onClick={onPick}><span className="fort">♜</span><strong>{state.name}</strong><small>{state.capital} · {state.zone}</small></button>;
}
