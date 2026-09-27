import {
  CameraOff,
  FileVideo2,
  RotateCcw,
} from 'lucide-react'

interface Props {
  message: string
  onRetry(): void
  onVideo(): void
}

export function CameraError({
  message,
  onRetry,
  onVideo,
}: Props) {
  return (
    <main className="flex h-full items-center justify-center bg-[#050505] px-5 text-white">
      <section className="w-full max-w-xl">
        <CameraOff
          size={22}
          className="mb-9 text-white/46"
        />

        <h1 className="text-5xl leading-[0.9] font-medium tracking-[-0.05em] md:text-7xl">
          CAMERA ACCESS
          <br />
          WASN&apos;T AVAILABLE.
        </h1>

        <p className="mt-7 max-w-md text-sm leading-6 text-white/48">
          {message} Allow camera
          access and try again, or
          process a video already on
          this device.
        </p>

        <div className="mt-9 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center justify-between bg-white px-5 py-4 text-[10px] font-semibold tracking-[0.14em] text-black"
          >
            TRY AGAIN
            <RotateCcw size={14} />
          </button>

          <button
            type="button"
            onClick={onVideo}
            className="flex items-center justify-between border border-white/14 px-5 py-4 text-[10px] tracking-[0.14em] text-white/68"
          >
            USE VIDEO FILE
            <FileVideo2 size={14} />
          </button>
        </div>
      </section>
    </main>
  )
}