export function BattleHUD({ round, total, score, streak }: { round: number; total: number; score: number; streak: number }) {
  return <div className="battle-hud"><span>ROUND {String(round).padStart(2, "0")} / {String(total).padStart(2, "0")}</span><span>{score.toLocaleString()} PTS</span><span>{streak > 1 ? `${streak}× STREAK` : "READY"}</span></div>;
}
