import { useOnlineState } from '../hooks/useOnlineState'

export function HomeScreen({ onScan, onAbout }: { onScan: () => void; onAbout: () => void }) {
  const online = useOnlineState()
  return <main className="home-screen page-shell">
    {!online && <div className="offline-note">Browser reports offline</div>}
    <div className="hero-copy"><span className="eyebrow">DAY 20 / NETWORK WEATHER</span><h1>How is your<br /><em>connection</em> feeling?</h1><p>A plain-language read on the network you're using right now. No account. No location tracking. Just a few real checks.</p></div>
    <button className="primary-cta" onClick={onScan}>CHECK MY NETWORK <span>↗</span></button>
    <button className="text-cta" onClick={onAbout}>How this works <span>→</span></button>
    <div className="home-footer"><span>HTTP LATENCY · STABILITY · OPTIONAL BANDWIDTH</span><span>LOCAL MEASUREMENT / 01</span></div>
  </main>
}
