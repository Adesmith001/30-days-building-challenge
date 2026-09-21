import { arenaLevel } from "../lib/scoring";

export function ArenaBase({ trophies, discovered }: { trophies: number; discovered: number }) {
  const level = arenaLevel(trophies);
  const progress = Math.round((discovered / 36) * 100);
  return <div className="arena-base"><div className="arena-base-row"><span className="rank-mark">◇</span><div><small>ARENA BASE</small><b>LEVEL {level}</b></div><strong>{trophies}<small>TROPHIES</small></strong></div><div className="territory-track"><i style={{ width: `${progress}%` }} /></div><p><span>{discovered}/36 STRONGHOLDS</span><span>{progress}% CLAIMED</span></p></div>;
}
