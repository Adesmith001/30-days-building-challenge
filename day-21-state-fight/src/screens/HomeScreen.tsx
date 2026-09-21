import { ArenaBase } from "../components/ArenaBase";
import type { ProgressData } from "../types/game";

export function HomeScreen({ progress, onCampaign, onModes, onAtlas, onHistory }: { progress: ProgressData; onCampaign: () => void; onModes: () => void; onAtlas: () => void; onHistory: () => void }) {
  return (
    <section className="home-screen tactical-grid">
      <div className="home-hero">
        <div className="home-copy">
          <p className="eyebrow">NIGERIA // DATA ARENA</p>
          <h1>KNOW YOUR <em>STATES.</em><br />CLAIM THE FIELD.</h1>
          <p className="lede">Read the numbers. Choose the stronger state. Take the map in ten rounds built from real Nigerian data.</p>
          <nav className="home-nav" aria-label="Explore State Fight">
            <button onClick={onAtlas}>STATE ATLAS <span>↗</span></button>
            <button onClick={onHistory}>BATTLE HISTORY <span>↗</span></button>
          </nav>
        </div>
        <aside className="campaign-console" aria-label="Campaign launch">
          <div className="console-heading"><span className="status-light" /><span>CAMPAIGN READY</span><small>10 ROUNDS</small></div>
          <ArenaBase trophies={progress.trophies} discovered={progress.discovered.length} />
          <div className="mission-brief"><span>PRIMARY OBJECTIVE</span><strong>WIN THE DATA BATTLE</strong><p>Compare population, land area, revenue and more. Every win reveals a new stronghold.</p></div>
          <button className="primary-button campaign-button" onClick={onCampaign}><span>ENTER CAMPAIGN</span><b>→</b></button>
          <button className="secondary-button modes-button" onClick={onModes}>CHOOSE ANOTHER MODE</button>
        </aside>
      </div>
      <footer className="home-footer"><span>36 STATES + FCT</span><span>6 DATA FRONTS</span><span>ONE FIELD TO CLAIM</span></footer>
    </section>
  );
}
