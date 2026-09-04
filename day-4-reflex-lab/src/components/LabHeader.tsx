import {
  useState,
} from 'react'

import {
  Settings,
  SquareTerminal,
} from 'lucide-react'

import {
  AboutPanel,
} from './AboutPanel'

type Props = {
  calibrated?: boolean
}

export function LabHeader({
  calibrated = false,
}: Props) {
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <>
      <header
        className="
          flex h-17
          items-center
          justify-between
          border-b
          border-[#c9c7b5]
          px-6
          md:px-10
        "
      >
        <div
          className="
            flex items-center gap-4
            font-mono text-xs
            font-semibold
            tracking-[0.18em]
            text-[#4a4d3f]
          "
        >
          <span>
            04 / 30
          </span>

          <span
            className="
              h-3 w-px
              bg-[#c9c7b5]
            "
          />

          <span
            className="
              hidden sm:inline
            "
          >
            {calibrated
              ? 'PROTOCOL_ACTIVE'
              : 'LAB_ENV // V2.8'}
          </span>
        </div>

        <div
          className="
            absolute left-1/2
            -translate-x-1/2
            text-lg font-black
            tracking-tight
            md:text-2xl
          "
        >
          REFLEX LAB
        </div>

        <nav
          className="
            flex items-center gap-5
            font-mono text-xs
            font-semibold
            tracking-[0.18em]
            text-[#4a4d3f]
          "
        >
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="
              hidden
              border-0
              bg-transparent
              p-0
              font-inherit
              hover:text-black
              md:inline
            "
          >
            ABOUT
          </button>

          <span
            className="
              hidden
              text-[#aaa997]
              md:inline
            "
          >
            ·
          </span>

          <a
            className="
              hidden
              hover:text-black
              md:inline
            "
            href="https://github.com/Adesmith001/30-days-building-challenge"
            target="_blank"
            rel="noreferrer"
          >
            SOURCE ↗
          </a>

          {calibrated && (
            <span
              className="
                hidden
                border
                border-[#232323]
                px-4 py-2
                md:inline
              "
            >
              CALIBRATE
            </span>
          )}

          <SquareTerminal
            size={18}
            strokeWidth={1.7}
          />

          <Settings
            size={19}
            strokeWidth={1.7}
          />
        </nav>
      </header>

      <div
        className="
          flex h-8
          items-center
          justify-between
          border-b
          border-[#d9d6c7]
          bg-[#eeece6]
          px-6
          font-mono
          text-[10px]
          font-semibold
          tracking-[0.16em]
          text-[#55594a]
          md:px-10
        "
      >
        <span>
          <b
            className="
              mr-2
              text-[#5f7f00]
            "
          >
            ■
          </b>

          {calibrated
            ? 'SYS_STATUS: READY · POLLING: 1000HZ RAW INPUT'
            : 'SAMPLE_RATE: 1000HZ'}
        </span>

        <span
          className="
            hidden md:inline
          "
        >
          {calibrated
            ? 'DISPLAY_SYNC: 240FPS SYNCHRONOUS'
            : 'DRIVER_LATENCY: < 0.8MS · SYNC: VERIFIED'}
        </span>

        <span
          className="
            hidden lg:inline
          "
        >
          {calibrated
            ? 'ENV: LAB_CALIBRATED'
            : 'STABLE'}
        </span>
      </div>

      <AboutPanel
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </>
  )
}