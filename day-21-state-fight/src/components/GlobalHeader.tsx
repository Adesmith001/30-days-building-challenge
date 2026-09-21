import { Settings } from "lucide-react";

export function GlobalHeader({ trophies, onHome, onSettings }: { trophies: number; onHome: () => void; onSettings: () => void }) {
  return <header className="global-header"><button className="brand" onClick={onHome}>STATE<span>FIGHT</span></button><div className="header-actions"><span className="trophy">◆ {trophies} trophies</span><button className="icon-button" aria-label="Open settings" onClick={onSettings}><Settings size={18} /></button></div></header>;
}
