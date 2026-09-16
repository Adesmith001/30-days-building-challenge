import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import PrimaryButton from "../components/PrimaryButton";

export default function LandingScreen({
  onStart,
  onDemo,
}: {
  onStart: () => void;
  onDemo: () => void;
}) {
  return (
    <main
      className="
        mx-auto
        flex
        min-h-[calc(100vh-70px)]
        w-full
        max-w-7xl
        flex-col
        justify-between
        px-5
        py-10
        md:px-10
        md:py-16
      "
    >
      <motion.section
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          max-w-5xl
        "
      >
        <p
          className="
            mb-5
            font-mono
            text-xs
            text-muted
          "
        >
          HOUSING // COMMUTE
          TRADE-OFF SIMULATOR
        </p>

        <h1
          className="
            font-serif
            text-[clamp(3.8rem,10vw,9rem)]
            leading-[0.82]
            tracking-[-0.05em]
          "
        >
          CHEAPER RENT
          <br />

          ISN’T ALWAYS
          <br />

          <span
            className="
              text-cobalt
            "
          >
            CHEAPER.
          </span>
        </h1>

        <p
          className="
            mt-8
            max-w-xl
            text-base
            leading-7
            text-muted
            md:text-lg
          "
        >
          Compare rent,
          transport and the hours
          you’ll spend getting
          there. Money and time
          stay separate until you
          choose otherwise.
        </p>

        <div
          className="
            mt-8
            flex
            flex-wrap
            gap-3
          "
        >
          <PrimaryButton
            onClick={onStart}
            className="
              flex
              items-center
              gap-2
            "
          >
            COMPARE TWO HOMES

            <ArrowRight
              size={14}
            />
          </PrimaryButton>

          <button
            onClick={onDemo}
            className="
              flex
              items-center
              gap-2
              border
              border-ink
              px-5
              py-3
              font-mono
              text-xs
              uppercase
              hover:border-cobalt
              hover:text-cobalt
            "
          >
            <Sparkles
              size={14}
            />

            TRY THE YABA /
            IKORODU DEMO
          </button>
        </div>
      </motion.section>

      <footer
        className="
          mt-16
          flex
          flex-wrap
          justify-between
          gap-4
          border-t
          border-line
          pt-5
          font-mono
          text-[10px]
          text-muted
        "
      >
        <span>
          MONEY · TIME · COMMUTE
          · BREAK-EVEN
        </span>

        <span>
          NO ADDRESS REQUIRED ·
          NO ADVICE · JUST THE
          TRADE-OFF
        </span>
      </footer>
    </main>
  );
}