import {
  Info,
} from 'lucide-react'

import { SOURCE_URL } from '../../lib/constants'
import { formatDuration } from '../../lib/time'

interface Props {
  exposureMs: number
  mode: string
  focus: boolean
  sourceKind: string
  onAbout(): void
}

export function TopBar({
  exposureMs,
  mode,
  focus,
  sourceKind,
  onAbout,
}: Props) {
  if (focus) return null

  return (
    <header className="safe-top pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-4 text-[9px] tracking-[0.14em] text-white/66 md:px-6">
      <div className="pointer-events-auto flex items-center gap-4">
        <span>28 / 30</span>

        <span className="hidden text-white/36 sm:inline">
          LIGHT PAINTER
        </span>
      </div>

      <div className="rounded-full border border-white/10 bg-black/24 px-3 py-2 backdrop-blur-md">
        <span className="text-white/38">
          EXPOSURE
        </span>{' '}
        {formatDuration(
          exposureMs,
        )}
      </div>

      <div className="pointer-events-auto flex items-center gap-4">
        <span className="hidden text-white/36 sm:inline">
          {sourceKind === 'video'
            ? 'VIDEO SOURCE'
            : mode.toUpperCase()}
        </span>

        <button
          type="button"
          onClick={onAbout}
          className="flex items-center gap-1 hover:text-white"
        >
          <Info size={12} />
          ABOUT
        </button>

        {SOURCE_URL && (
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden hover:text-white md:inline"
          >
            SOURCE ↗
          </a>
        )}
      </div>
    </header>
  )
}