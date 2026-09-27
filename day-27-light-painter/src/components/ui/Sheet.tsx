import type {
  ReactNode,
} from 'react'

import { X } from 'lucide-react'

interface Props {
  title: string
  onClose(): void
  children: ReactNode
  wide?: boolean
}

export function Sheet({
  title,
  onClose,
  children,
  wide = false,
}: Props) {
  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/20 md:items-stretch md:justify-end">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section
        className={[
          'safe-bottom relative z-10 max-h-[76dvh] w-full overflow-y-auto border-t border-white/12 bg-[#0a0a0a]/96 backdrop-blur-xl md:h-full md:max-h-none md:border-l md:border-t-0',
          wide
            ? 'md:w-[520px]'
            : 'md:w-[380px]',
        ].join(' ')}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-5 py-4 backdrop-blur-xl">
          <span className="text-[11px] font-medium tracking-[0.18em] text-white/72">
            {title}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full border border-white/10 text-white/70 hover:bg-white/8 hover:text-white"
          >
            <X size={16} />
          </button>
        </header>

        {children}
      </section>
    </div>
  )
}