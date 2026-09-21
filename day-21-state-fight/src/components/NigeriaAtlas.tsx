export function NigeriaAtlas({ discovered, total = 36 }: { discovered: number; total?: number }) {
  const progress = Math.round((discovered / total) * 100);
  return <div className="atlas-summary"><strong>{discovered}<small> / {total} discovered</small></strong><div><i style={{ width: `${progress}%` }} /></div></div>;
}
