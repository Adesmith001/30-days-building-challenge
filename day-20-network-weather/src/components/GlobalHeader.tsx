import { formatNetworkSpeed, useNetworkInfo } from '../hooks/useNetworkInfo'

interface GlobalHeaderProps {
  screen: string
  onNavigate: (screen: 'home' | 'history' | 'about') => void
}

export function GlobalHeader({ screen, onNavigate }: GlobalHeaderProps) {
  const { downlink } = useNetworkInfo()

  return (
    <header className="site-header">
      <button
        type="button"
        className="brand"
        onClick={() => onNavigate('home')}
        aria-label="Go to Network Weather home"
      >
        <span className="brand-mark">◌</span>
        NETWORK WEATHER
      </button>
      <div className="header-tools">
        <div className="network-speed" aria-label={`Browser speed estimate: ${formatNetworkSpeed(downlink)}`}>
          <span>Browser estimate</span>
          <strong>{formatNetworkSpeed(downlink)}</strong>
        </div>
        <nav aria-label="Primary navigation">
          <button
            className={screen === 'history' ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavigate('history')}
          >
            History
          </button>
          <button
            className={screen === 'about' ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavigate('about')}
          >
            About
          </button>
        </nav>
      </div>
    </header>
  )
}
