export function CampaignScreen({ onViewResults }: { onViewResults: () => void }) {
  return (
    <section className="screen campaign-screen centre">
      <p className="eyebrow">OPERATION COMPLETE</p>
      <h1>CAMPAIGN <em>SECURED</em></h1>
      <p className="lede">The field is yours. Review your score, trophies, and newly claimed strongholds.</p>
      <button className="primary-button" onClick={onViewResults}>VIEW RESULTS</button>
    </section>
  );
}
