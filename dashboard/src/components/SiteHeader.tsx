export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="30 Builds in 30 Days home">
        ADESMITH
      </a>
      <nav aria-label="Primary navigation">
        <a href="#projects">Projects</a>
        <a href="https://github.com/Adesmith001" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/toluwani-somade-79b7b0400?" target="_blank" rel="noreferrer">LinkedIn</a>
      </nav>
    </header>
  );
}
