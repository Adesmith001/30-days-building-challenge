export function PowerClash({ correct }: { correct: boolean }) {
  return <p className={`power-clash ${correct ? "clash-win" : "clash-loss"}`}>{correct ? "⚡ BREAKTHROUGH CONFIRMED" : "✕ DEFENCES HOLD"}</p>;
}
