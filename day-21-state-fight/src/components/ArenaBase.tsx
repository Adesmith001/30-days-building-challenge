import { arenaLevel } from "../lib/scoring";

export function ArenaBase({ trophies, discovered }: { trophies: number; discovered: number }) {
  const level = arenaLevel(trophies);
  return <div className="arena-base"><span>◈</span><div><b>ARENA BASE // LEVEL {level}</b><small>{trophies} trophies · {discovered}/36 strongholds discovered</small></div></div>;
}
