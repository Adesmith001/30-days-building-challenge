interface GlobalHeaderProps { screen: string; onNavigate: (screen: 'home' | 'history' | 'about') => void }

export function GlobalHeader({ screen, onNavigate }: GlobalHeaderProps) {
  return <header className="site-header">
    <button className="brand" onClick={() => onNavigate('home')}><span className="brand-mark">◌</span> NETWORK WEATHER</button>
    <nav aria-label="Primary navigation">
      <button className={screen === 'history' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('history')}>History</button>
      <button className={screen === 'about' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('about')}>About</button>
    </nav>
  </header>
}
