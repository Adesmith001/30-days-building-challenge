import {
  ArrowRight,
  Aperture,
} from 'lucide-react'

interface Props {
  onOpen(): void
  onHow(): void
}

export function Landing({
  onOpen,
  onHow,
}: Props) {
  return (
    <main className="relative h-full overflow-hidden bg-[#050505] text-[#f3f1eb]">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 text-[10px] tracking-[0.17em] text-white/55 md:px-8">
        <span>28 / 30</span>

        <span>LIGHT PAINTER</span>

        <button
          type="button"
          onClick={onHow}
          className="hover:text-white"
        >
          HOW IT WORKS
        </button>
      </header>

      <svg
        aria-hidden="true"
        viewBox="0 0 1600 900"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="blur">
            <feGaussianBlur
              stdDeviation="18"
            />
          </filter>

          <filter id="glow">
            <feGaussianBlur
              stdDeviation="4"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient
            id="trail"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#ffffff"
              stopOpacity="0"
            />
            <stop
              offset="26%"
              stopColor="#8eeaff"
            />
            <stop
              offset="63%"
              stopColor="#ffffff"
            />
            <stop
              offset="100%"
              stopColor="#ff70c9"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <path
          d="M-100 640 C 260 120, 520 780, 920 390 S 1390 210, 1700 640"
          fill="none"
          stroke="url(#trail)"
          strokeWidth="46"
          filter="url(#blur)"
          opacity="0.22"
        />

        <path
          d="M-100 640 C 260 120, 520 780, 920 390 S 1390 210, 1700 640"
          fill="none"
          stroke="url(#trail)"
          strokeWidth="5"
          filter="url(#glow)"
        />
      </svg>

      <section className="relative z-10 flex h-full max-w-6xl flex-col justify-end px-5 pb-10 pt-28 md:justify-center md:px-10 md:pb-0">
        <div className="max-w-4xl">
          <div className="mb-7 flex size-9 items-center justify-center rounded-full border border-white/14 text-white/70">
            <Aperture size={15} />
          </div>

          <h1 className="text-[20vw] leading-[0.78] font-medium tracking-[-0.075em] sm:text-[15vw] md:text-[10rem]">
            DRAW
            <br />
            WITH LIGHT.
          </h1>

          <p className="mt-8 max-w-md text-sm leading-6 text-white/54 md:text-base">
            Turn your camera into a
            digital long-exposure canvas.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpen}
              className="flex items-center gap-8 bg-[#f2f0e9] px-5 py-4 text-[11px] font-semibold tracking-[0.15em] text-black hover:bg-white"
            >
              OPEN CAMERA
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={onHow}
              className="px-5 py-4 text-[10px] tracking-[0.15em] text-white/56 hover:text-white"
            >
              HOW IT WORKS
            </button>
          </div>

          <p className="mt-7 text-[9px] tracking-[0.14em] text-white/28">
            LOCAL CAMERA PROCESSING ·
            NOTHING UPLOADED
          </p>
        </div>
      </section>
    </main>
  )
}