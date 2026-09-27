import {
  ArrowRight,
  LoaderCircle,
} from 'lucide-react'

interface Props {
  state:
    | 'intro'
    | 'calibrating'
    | 'ready'
  onStart(): void
}

export function FirstRunOverlay({
  state,
  onStart,
}: Props) {
  if (state === 'calibrating') {
    return (
      <div className="absolute inset-0 z-30 grid place-items-center bg-black/12 px-5 backdrop-blur-[1px]">
        <div className="text-center">
          <LoaderCircle
            size={20}
            className="mx-auto mb-5 animate-spin text-white/60"
          />

          <p className="text-lg tracking-[-0.03em]">
            CALIBRATING
            <br />
            THE ROOM...
          </p>

          <p className="mt-3 text-[10px] tracking-[0.12em] text-white/42">
            MEASURING BACKGROUND LIGHT
            AND MOTION NOISE
          </p>
        </div>
      </div>
    )
  }

  if (state === 'ready') {
    return (
      <div className="absolute inset-0 z-30 grid place-items-center bg-black/8">
        <p className="rounded-full border border-white/14 bg-black/28 px-5 py-3 text-[10px] tracking-[0.2em] backdrop-blur-md">
          READY.
        </p>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/14 px-4 pb-32 md:items-center md:pb-0">
      <section className="w-full max-w-sm border border-white/12 bg-black/45 p-5 backdrop-blur-xl">
        <p className="mb-6 text-[9px] tracking-[0.2em] text-white/42">
          TRY THIS.
        </p>

        {[
          'DIM THE ROOM',
          'TURN ON A PHONE FLASHLIGHT',
          'MOVE IT IN FRONT OF THE CAMERA',
        ].map((text, index) => (
          <div
            key={text}
            className="flex gap-4 border-t border-white/9 py-4"
          >
            <span className="text-[10px] text-white/34">
              {index + 1}
            </span>

            <span className="text-[10px] tracking-[0.13em] text-white/76">
              {text}
            </span>
          </div>
        ))}

        <button
          type="button"
          onClick={onStart}
          className="mt-2 flex w-full items-center justify-between bg-white px-4 py-4 text-[10px] font-semibold tracking-[0.14em] text-black"
        >
          START PAINTING
          <ArrowRight size={14} />
        </button>

        <p className="mt-3 text-center text-[8px] tracking-[0.12em] text-white/30">
          AUTO CALIBRATES FIRST
        </p>
      </section>
    </div>
  )
}