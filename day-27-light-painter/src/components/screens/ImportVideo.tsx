import {
  ArrowLeft,
  Upload,
} from 'lucide-react'

interface Props {
  onFile(file: File): void
  onBack(): void
}

export function ImportVideo({
  onFile,
  onBack,
}: Props) {
  return (
    <main className="flex h-full flex-col bg-[#050505] px-5 text-white md:px-8">
      <header className="flex items-center justify-between py-5 text-[10px] tracking-[0.17em] text-white/48">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 hover:text-white"
        >
          <ArrowLeft size={13} />
          BACK
        </button>

        <span>VIDEO SOURCE</span>

        <span>28 / 30</span>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 items-center">
        <label className="group block w-full cursor-pointer border border-dashed border-white/18 p-8 hover:border-white/44 md:p-14">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(event) => {
              const file =
                event.target.files?.[0]

              if (file) {
                onFile(file)
              }
            }}
          />

          <Upload
            size={20}
            className="mb-10 text-white/46 group-hover:text-white"
          />

          <h1 className="text-5xl leading-[0.88] font-medium tracking-[-0.055em] md:text-8xl">
            PAINT FROM
            <br />
            A VIDEO.
          </h1>

          <p className="mt-8 text-sm text-white/44">
            DROP VIDEO OR CHOOSE FILE
          </p>

          <p className="mt-2 text-[9px] tracking-[0.13em] text-white/26">
            THE FILE STAYS ON THIS DEVICE
          </p>
        </label>
      </section>
    </main>
  )
}