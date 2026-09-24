export function SiteHeader() {
  const isAbout = window.location.pathname === "/about";

  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="30 Builds in 30 Days home">
        <img src="/brand/logo-mark.svg" alt="" aria-hidden="true" />
        <span className="wordmark__copy">
          <span className="wordmark__title">30 BUILDS</span>
          <span className="wordmark__maker">ADESMITH</span>
        </span>
      </a>
      <nav aria-label="Primary navigation">
        <a className={!isAbout ? "is-active" : undefined} href="/#projects">Projects</a>
        <a className={isAbout ? "is-active" : undefined} href="/about">About</a>
        <a href="https://github.com/Adesmith001" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/toluwani-somade-79b7b0400?" target="_blank" rel="noreferrer">LinkedIn</a>
      </nav>
    </header>
  );
}
