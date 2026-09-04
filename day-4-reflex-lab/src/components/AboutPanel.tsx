import {
  motion,
} from 'framer-motion'

import {
  X,
} from 'lucide-react'

import type {
  ReactNode,
} from 'react'

type Props = {
  open: boolean
  onClose: () => void
}

export function AboutPanel({
  open,
  onClose,
}: Props) {
  if (!open) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      onMouseDown={onClose}
      role="presentation"
    >
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="h-full w-full max-w-lg overflow-y-auto border-l border-black bg-[#f7f7f7] p-7 md:p-10"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
      >
        <header className="flex items-start justify-between">
          <div>
            <div className="font-mono text-xs font-semibold tracking-[0.16em] text-[#687b1a]">
              DAY 04 / 30
            </div>

            <h2
              id="about-title"
              className="mt-2 text-4xl font-black tracking-[-0.06em]"
            >
              REFLEX LAB
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close about panel"
            className="border border-black p-2 transition-colors hover:bg-black hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <p className="mt-8 text-xl leading-8 tracking-[-0.02em]">
          A four-part reflex battery with Nigerian flavour, built to test speed,
          accuracy, and self-control.
        </p>

        <AboutSection title="HOW IT WORKS">
          Choose one test for a quick hit, or run the full battery to move
          through visual, audio, choice, and fakeout challenges in sequence.
        </AboutSection>

        <AboutSection title="THE RULE">
          React quickly, but do not panic. A false start breaks your combo, and
          clean runs unlock a 300 point mode bonus.
        </AboutSection>

        <AboutSection title="PRIVACY">
          Your scores stay in this browser. Personal bests are stored locally
          with LocalStorage and never leave the lab.
        </AboutSection>

        <AboutSection title="BUILT WITH">
          <span className="font-mono text-sm">
            React · TypeScript · Tailwind CSS · Motion
          </span>
        </AboutSection>
      </motion.aside>
    </motion.div>
  )
}

function AboutSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mt-9 border-t border-black/20 pt-6">
      <div className="font-mono text-xs font-semibold tracking-[0.16em] text-[#687b1a]">
        {title}
      </div>

      <div className="mt-4 leading-7 text-neutral-600">
        {children}
      </div>
    </section>
  )
}
