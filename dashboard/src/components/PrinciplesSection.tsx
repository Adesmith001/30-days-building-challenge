export function PrinciplesSection() {
  return (
    <section className="principles section-shell" aria-labelledby="principles-title">
      <div className="principles__heading reveal">
        <p className="eyebrow">WHY 30?</p>
        <h2 id="principles-title">The architecture of the challenge</h2>
        <p>
          The goal is not to build thirty startups. It is to get better at turning ideas into working software.
        </p>
      </div>
      <ol className="principle-grid">
        <li><span>01</span><h3>Build Small.</h3><p>Constrain the scope to what can be architected, developed, and deployed within one day.</p></li>
        <li><span>02</span><h3>Finish.</h3><p>A finished imperfect project beats an unfinished perfect one. Ship the working version.</p></li>
        <li><span>03</span><h3>Experiment.</h3><p>Use interfaces, APIs, browser technology, games, AI, and data as a daily technical lab.</p></li>
        <li><span>04</span><h3>Ship Publicly.</h3><p>Deploy, document, and make the work reachable without burying it in private folders.</p></li>
      </ol>
    </section>
  );
}
