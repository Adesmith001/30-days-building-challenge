import {
  Aperture,
  CircleStop,
  Eraser,
  Pause,
  Play,
  Settings2,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'

interface Props {
  painting: boolean
  recording: boolean
  focus: boolean
  visible: boolean

  onTogglePainting(): void
  onClear(): void
  onCapture(): void
  onMode(): void
  onExposure(): void
  onMore(): void
  onStopRecording(): void
}

function SmallButton({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  onClick(): void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-14 flex-col items-center gap-1.5 text-[8px] tracking-[0.1em] text-white/58 hover:text-white"
    >
      <span className="grid size-9 place-items-center rounded-full border border-white/12 bg-black/22 backdrop-blur-lg">
        {icon}
      </span>

      <span>{label}</span>
    </button>
  )
}

export function ControlBar({
  painting,
  recording,
  focus,
  visible,
  onTogglePainting,
  onClear,
  onCapture,
  onMode,
  onExposure,
  onMore,
  onStopRecording,
}: Props) {
  return (
    <div
      className={[
        'safe-bottom absolute inset-x-0 bottom-0 z-20 transition-opacity duration-300',
        visible
          ? 'opacity-100'
          : 'pointer-events-none opacity-0',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-3xl items-end justify-center gap-3 px-3 pb-2 sm:gap-6">
        {!focus && (
          <SmallButton
            label={
              painting
                ? 'PAUSE'
                : 'START'
            }
            icon={
              painting ? (
                <Pause size={15} />
              ) : (
                <Play size={15} />
              )
            }
            onClick={onTogglePainting}
          />
        )}

        {!focus && (
          <SmallButton
            label="CLEAR"
            icon={
              <Eraser size={15} />
            }
            onClick={onClear}
          />
        )}

        <button
          type="button"
          onClick={
            recording
              ? onStopRecording
              : onCapture
          }
          aria-label={
            recording
              ? 'Stop recording'
              : 'Capture image'
          }
          className="mx-2 grid size-16 place-items-center rounded-full border border-white/45 bg-black/20 backdrop-blur-md md:size-18"
        >
          <span
            className={[
              'grid size-12 place-items-center rounded-full transition',
              recording
                ? 'bg-red-500 text-white'
                : 'bg-white text-black',
            ].join(' ')}
          >
            {recording ? (
              <CircleStop size={19} />
            ) : (
              <Aperture size={20} />
            )}
          </span>
        </button>

        {!focus && (
          <SmallButton
            label="MODE"
            icon={
              <Sparkles size={15} />
            }
            onClick={onMode}
          />
        )}

        {!focus && (
          <SmallButton
            label="EXPOSURE"
            icon={
              <SlidersHorizontal
                size={15}
              />
            }
            onClick={onExposure}
          />
        )}

        {!focus && (
          <SmallButton
            label="MORE"
            icon={
              <Settings2 size={15} />
            }
            onClick={onMore}
          />
        )}
      </div>
    </div>
  )
}