import type { NetworkWeather } from '../types/network'

const symbols: Record<NetworkWeather, string> = {
  clear: '☼',
  cloudy: '◒',
  rain: '⋰',
  storm: 'ϟ',
  offline: '×',
}

export function WeatherScene({ weather, compact = false }: { weather: NetworkWeather; compact?: boolean }) {
  const className = compact ? `weather-scene compact ${weather}` : `weather-scene ${weather}`

  return (
    <div role="img" className={className} aria-label={`${weather} network weather`}>
      <span className="weather-symbol">{symbols[weather]}</span>
      <span className="weather-label">{weather.toUpperCase()}</span>
    </div>
  )
}
