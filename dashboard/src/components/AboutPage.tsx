export function AboutPage() {
  return (
    <main className="about-page section-shell" id="top">
      <p className="eyebrow">About the challenge</p>
      <div className="about-page__intro">
        <h1>Thirty days of making things real.</h1>
        <p>
          30 Builds in 30 Days is a public record of experiments, tools, games,
          and small pieces of software built and shipped one day at a time.
        </p>
      </div>
      <div className="about-page__details">
        <section>
          <p className="section-label__eyebrow">The brief</p>
          <h2>One idea. One build. Every day.</h2>
          <p>
            Each project starts with a simple prompt and ends with something
            usable, shareable, or at least worth learning from.
          </p>
        </section>
        <section>
          <p className="section-label__eyebrow">What you will find here</p>
          <h2>A trail of decisions.</h2>
          <p>
            Browse the archive to see the interfaces, constraints, technologies,
            and lessons behind every completed day.
          </p>
        </section>
      </div>
      <a className="about-page__back" href="/#projects">Browse the projects →</a>
    </main>
  );
}
