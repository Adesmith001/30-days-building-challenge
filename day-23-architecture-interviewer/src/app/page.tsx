import Link from "next/link";

import {
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <main
      className="
        flex min-h-dvh
        flex-col px-6
        md:px-10
        landing-grid
        relative isolate overflow-hidden
      "
    >
      <header
        className="
          grid h-20
          grid-cols-3
          items-center
          text-[11px]
          font-medium
          tracking-[0.12em]
          relative z-10
        "
      >
        <span>
          23 / 30
        </span>

        <span
          className="
            text-center
            max-sm:hidden
          "
        >
          ARCHITECTURE INTERVIEWER
        </span>

        <Link
          href="/auth"
          className="
            justify-self-end
            hover:opacity-60
          "
        >
          SIGN IN
        </Link>
      </header>

      <section
        className="
          flex flex-1
          flex-col
          items-center
          justify-center
          pb-20
          relative z-10
          text-center
        "
      >
        <p
          className="
            mb-5 text-[11px]
            font-medium
            tracking-[0.16em]
            text-muted
            sm:hidden
          "
        >
          ARCHITECTURE INTERVIEWER
        </p>

        <h1
          className="
            text-[clamp(3.3rem,9vw,8rem)]
            font-medium
            leading-[0.86]
            tracking-[-0.065em]
          "
        >
          DEFEND
          <br />
          YOUR DESIGN.
        </h1>

        <p
          className="
            mt-8 max-w-md
            text-base
            leading-7
            text-muted-foreground
            md:text-lg
          "
        >
          Describe your architecture.
          <br />
          I&apos;ll question every
          assumption.
        </p>

        <Link
          href="/auth"
          className="
            mt-9
            inline-flex
            items-center
            gap-2
            rounded-md
            bg-foreground
            px-5 py-3
            text-xs
            font-medium
            tracking-[0.08em]
            text-background
            transition-opacity
            hover:opacity-85
          "
        >
          START INTERVIEW

          <ArrowRight
            size={14}
          />
        </Link>

        <div
          className="
            mt-12 flex
            max-w-2xl
            flex-wrap
            justify-center
            gap-x-6 gap-y-3
            text-xs
            text-muted
          "
        >
          <span>
            Design a URL shortener
          </span>

          <span>
            Review my payment architecture
          </span>

          <span>
            Stress-test an event-driven system
          </span>
        </div>
      </section>
    </main>
  );
}
