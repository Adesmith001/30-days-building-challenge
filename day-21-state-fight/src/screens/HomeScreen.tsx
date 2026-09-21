import { ArenaBase } from "../components/ArenaBase";
import type { ProgressData } from "../types/game";

export function HomeScreen({ progress, onCampaign, onModes, onAtlas, onHistory }: { progress: ProgressData; onCampaign: () => void; onModes: () => void; onAtlas: () => void; onHistory: () => void }) {
  return <section className="home-screen tactical-grid"><p className="eyebrow">NIGERIA // DATA ARENA</p><h1>KNOW YOUR <em>STATES.</em><br />CLAIM THE FIELD.</h1><p className="lede">Real Nigerian state data becomes a ten-round tactical challenge. Choose the state with the stronger stat.</p><ArenaBase trophies={progress.trophies} discovered={progress.discovered.length} /><div className="home-actions"><button className="primary-button" onClick={onCampaign}>ENTER CAMPAIGN</button><button className="secondary-button" onClick={onModes}>BATTLE MODES</button></div><nav className="home-nav"><button onClick={onAtlas}>STATE ATLAS</button><button onClick={onHistory}>BATTLE HISTORY</button></nav></section>;
}
