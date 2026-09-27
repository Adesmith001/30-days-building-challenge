import {
  ArrowLeft,
  ArrowRight,
  Camera,
  FileVideo2,
} from 'lucide-react'

interface Props {
  onContinue(): void
  onVideo(): void
  onBack(): void
}

export function Privacy({
  onContinue,
  onVideo,
  onBack,
}: Props) {
  return (
    <main className="relative flex h-full flex-col bg-[#050505] px-5 text-[#f3f1eb] md:px-8">
      <header className="flex items-center justify-between py-5 text-[10px] tracking-[0.17em] text-white/48">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 hover:text-white"
        >
          <ArrowLeft size={13} />
          BACK
        </button>

        <span>LIGHT PAINTER</span>

        <span>28 / 30</span>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 items-center">
        <div className="grid w-full gap-12 md:grid-cols-[1.1fr_.9fr] md:items-end">
          <div>
            <div className="mb-8 grid size-11 place-items-center rounded-full border border-white/12 text-white/68">
              <Camera size={17} />
            </div>

            <h1 className="text-6xl leading-[0.88] font-medium tracking-[-0.055em] sm:text-7xl md:text-8xl">
              YOUR CAMERA
              <br />
              STAYS HERE.
            </h1>
          </div>

          <div className="md:pb-2">
            <p className="max-w-sm text-sm leading-6 text-white/52">
              Light Painter processes
              video directly in your
              browser. Camera frames are
              not uploaded or stored on
              a server.
            </p>

            <button
              type="button"
              onClick={onContinue}
              className="mt-8 flex w-full items-center justify-between bg-white px-5 py-4 text-[11px] font-semibold tracking-[0.15em] text-black"
            >
              CONTINUE
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={onVideo}
              className="mt-3 flex w-full items-center justify-between border border-white/12 px-5 py-4 text-[10px] tracking-[0.14em] text-white/64 hover:bg-white/6 hover:text-white"
            >
              USE VIDEO FILE INSTEAD
              <FileVideo2 size={14} />
            </button>
          </div>
        </div>
      </section>

      <footer className="pb-6 text-[9px] tracking-[0.13em] text-white/28">
        NO MICROPHONE REQUIRED · EXPORT
        ONLY WHEN YOU CHOOSE
      </footer>
    </main>
  )
}