import type {
  DebugView,
  PainterStats,
} from '../../types/painter'

import { Sheet } from '../ui/Sheet'

interface Props {
  view: DebugView
  stats: PainterStats

  onView(view: DebugView): void
  onClose(): void
}

const VIEWS: {
  key: DebugView
  title: string
  note: string
}[] = [
  {
    key: 'final',
    title: 'FINAL',
    note: 'BACKGROUND + ACCUMULATED TRAIL.',
  },
  {
    key: 'source',
    title: 'SOURCE',
    note: 'LIVE VIDEO TEXTURE.',
  },
  {
    key: 'luminance',
    title: 'LUMINANCE',
    note: 'BRIGHT PIXELS ARE CANDIDATE LIGHT.',
  },
  {
    key: 'motion',
    title: 'MOTION',
    note: 'WHAT CHANGED SINCE THE PREVIOUS FRAME?',
  },
  {
    key: 'mask',
    title: 'MASK',
    note: 'BRIGHTNESS + MOTION.',
  },
  {
    key: 'accumulation',
    title: 'ACCUMULATION',
    note: 'EACH FRAME ADDS TO THE LAST.',
  },
]

export function EnginePanel({
  view,
  stats,
  onView,
  onClose,
}: Props) {
  const current =
    VIEWS.find(
      (item) =>
        item.key === view,
    )!

  return (
    <Sheet
      title="ENGINE"
      onClose={onClose}
    >
      <div className="px-5 pb-10">
        <p className="pt-6 text-[9px] tracking-[0.18em] text-white/34">
          SEE WHAT BUILDS THE TRAIL.
        </p>

        <div className="mt-5">
          {VIEWS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() =>
                onView(item.key)
              }
              className={[
                'flex w-full items-center justify-between border-t border-white/9 py-4 text-left',
                view === item.key
                  ? 'text-white'
                  : 'text-white/42',
              ].join(' ')}
            >
              <span className="text-[10px] tracking-[0.13em]">
                {item.title}
              </span>

              {view === item.key && (
                <span className="text-[8px] tracking-[0.13em]">
                  LIVE
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-4 min-h-10 text-[10px] leading-5 tracking-[0.09em] text-white/44">
          {current.note}
        </p>

        <div className="mt-9 grid grid-cols-2 gap-px bg-white/8">
          <div className="bg-[#0a0a0a] p-4">
            <p className="text-[8px] tracking-[0.15em] text-white/32">
              PROCESSING
            </p>

            <p className="mt-2 text-sm">
              {Math.round(
                stats.fps,
              )}{' '}
              FPS
            </p>
          </div>

          <div className="bg-[#0a0a0a] p-4">
            <p className="text-[8px] tracking-[0.15em] text-white/32">
              RESOLUTION
            </p>

            <p className="mt-2 text-sm">
              {stats.width} ×{' '}
              {stats.height}
            </p>
          </div>

          <div className="bg-[#0a0a0a] p-4">
            <p className="text-[8px] tracking-[0.15em] text-white/32">
              ENGINE
            </p>

            <p className="mt-2 text-sm">
              {stats.engine}
            </p>
          </div>

          <div className="bg-[#0a0a0a] p-4">
            <p className="text-[8px] tracking-[0.15em] text-white/32">
              VIEW
            </p>

            <p className="mt-2 text-sm">
              {view.toUpperCase()}
            </p>
          </div>
        </div>

        <p className="mt-9 text-[9px] leading-5 tracking-[0.12em] text-white/32">
          SOURCE → BRIGHTNESS + MOTION →
          MASK → ACCUMULATE → COMPOSITE
        </p>
      </div>
    </Sheet>
  )
}