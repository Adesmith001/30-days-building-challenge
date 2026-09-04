import {
  motion,
} from 'framer-motion'

import {
  LabHeader,
} from './LabHeader'

type Props = {
  onStart: () => void
}

export function HomeScreen({
  onStart,
}: Props) {
  return (
    <main
      className="
        min-h-screen
        bg-[#f4f1eb]
        text-[#171717]
      "
    >
      <LabHeader />

      <section
        className="
          mx-auto
          flex
          min-h-[calc(100vh-100px)]
          max-w-6xl
          flex-col
          items-center
          justify-center
          px-6
          pb-24
          text-center
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
        >
          <div
            className="
              mx-auto mb-7
              flex w-fit
              items-center
              gap-5
              border
              border-[#bdbda7]
              px-4 py-2
              font-mono
              text-xs
              font-semibold
              tracking-[0.18em]
            "
          >
            <span
              className="
                h-2.5 w-2.5
                border
                border-[#617600]
                bg-[#c8ff00]
              "
            />

            REACTION SPEED TEST
          </div>

          <h1
            className="
              mx-auto
              max-w-3xl
              text-5xl
              font-black
              uppercase
              leading-[0.92]
              tracking-[-0.05em]
              sm:text-6xl
              md:text-7xl
            "
          >
            How fast are
            you really?
          </h1>

          <p
            className="
              mt-7
              text-base
              text-[#4e5243]
              md:text-lg
            "
          >
            Four tests.
            Twenty reactions.
            No excuses.
          </p>

          <div
            className="
              mx-auto mt-6
              flex
              max-w-xl
              items-center
              justify-between
              border-y
              border-[#d8d4c2]
              py-3
              font-mono
              text-xs
              font-semibold
              tracking-[0.24em]
              text-[#3f4336]
            "
          >
            <span>SEE AM</span>
            <span>·</span>
            <span>HEAR AM</span>
            <span>·</span>
            <span>CHOOSE</span>
            <span>·</span>
            <span>NO FALL</span>
          </div>

          <button
            onClick={onStart}
            className="
              mt-10
              min-w-[310px]
              bg-[#171717]
              px-10 py-6
              font-mono
              text-sm
              font-bold
              tracking-[0.12em]
              text-white
              transition
              hover:-translate-y-0.5
              hover:bg-black
              active:translate-y-0
            "
          >
            START TEST →
          </button>

          <p
            className="
              mt-4
              font-mono
              text-[11px]
              font-semibold
              tracking-[0.15em]
              text-[#55594a]
            "
          >
            4 TESTS · 20 ROUNDS ·
            ~2 MIN · NO DULLING
          </p>
        </motion.div>
      </section>
    </main>
  )
}