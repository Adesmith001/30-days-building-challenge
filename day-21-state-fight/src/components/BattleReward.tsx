export function BattleReward({ correct, score, winner, onNext }: { correct: boolean; score: number; winner: string; onNext: () => void }) {
  return <section className={`battle-reward ${correct ? "win" : "loss"}`}><p>{correct ? "BREAKTHROUGH" : "DEFENCES HOLD"}</p><h2>{winner} WINS</h2><strong>{correct ? `+${score.toLocaleString()} POINTS` : "NO POINTS THIS ROUND"}</strong><button className="primary-button" onClick={onNext}>CONTINUE</button></section>;
}
