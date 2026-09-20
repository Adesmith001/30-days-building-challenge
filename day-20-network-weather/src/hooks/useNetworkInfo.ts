import { useEffect, useState } from 'react'
import type { BrowserNetworkEstimate } from '../types/network'

type Connection = BrowserNetworkEstimate & {
  addEventListener?: (type: string, listener: () => void) => void
  removeEventListener?: (type: string, listener: () => void) => void
}

function readConnection() {
  return (navigator as Navigator & { connection?: Connection }).connection
}

export function formatNetworkSpeed(downlink?: number) {
  return downlink === undefined ? 'Unavailable' : `${downlink.toFixed(1)} Mbps`
}

export function useNetworkInfo() {
  const [estimate, setEstimate] = useState<BrowserNetworkEstimate>(() => {
    const connection = readConnection()
    return connection
      ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        }
      : {}
  })

  useEffect(() => {
    const connection = readConnection()
    if (!connection?.addEventListener) return
    const update = () =>
      setEstimate({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      })
    connection.addEventListener('change', update)
    return () => connection.removeEventListener?.('change', update)
  }, [])

  return estimate
}
