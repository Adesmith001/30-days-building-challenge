import type { RunSummary } from "../types/game";

export function ShareCard({ summary }: { summary: RunSummary }) {
  const share = async () => { const text = `I scored ${summary.score.toLocaleString()} points in State Fight — ${summary.wins}/${summary.totalBattles} battles won.`; if (navigator.share) await navigator.share({ title: "State Fight", text }); else await navigator.clipboard.writeText(text); };
  return <button className="secondary-button" onClick={() => void share()}>SHARE RESULT</button>;
}
