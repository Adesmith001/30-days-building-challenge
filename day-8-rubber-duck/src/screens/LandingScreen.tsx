import type {
  DuckSession,
} from "../schemas/session";

interface Props {
  latest?:
    DuckSession;

  onStart:
    () => void;

  onResume:
    (
      id: string,
    ) => void;
}

export function LandingScreen({
  latest,
  onStart,
  onResume,
}: Props) {
  return (
    <main
      className="
        flex
        min-h-[calc(100vh-132px)]
        flex-col
        px-5
        md:px-8
      "
    >
      <section
        className="
          mx-auto
          flex
          w-full
          max-w-3xl
          flex-1
          flex-col
          items-center
          justify-center
          py-20
          text-center
        "
      >
        <span
          className="
            border
            border-rule
            px-3
            py-2
            font-mono
            text-[9px]
            tracking-[0.22em]
            text-graphite
          "
        >
          THINK IT THROUGH
        </span>

        <h1
          className="
            mt-16
            font-serif
            text-5xl
            leading-[0.98]
            tracking-[-0.02em]
            md:text-7xl
          "
        >
          LET&apos;S FIGURE
          <br />
          IT OUT.
        </h1>

        <p
          className="
            mt-10
            max-w-2xl
            font-serif
            text-xl
            leading-8
            text-graphite
            md:text-2xl
            md:leading-10
          "
        >
          Tell me what
          you&apos;re stuck on.
          I&apos;ll ask the
          questions that help
          you see it more
          clearly.
        </p>

        <button
          onClick={
            onStart
          }
          className="
            mt-12
            border
            border-ink
            bg-ink
            px-8
            py-4
            font-mono
            text-[11px]
            tracking-[0.18em]
            text-white
          "
        >
          START THINKING →
        </button>

        {latest &&
        latest.status !==
          "resolved" ? (
          <button
            onClick={() =>
              onResume(
                latest.id,
              )
            }
            className="
              mt-10
              w-full
              max-w-lg
              border-t
              border-rule
              pt-5
              text-left
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                font-mono
                text-[9px]
                tracking-[0.14em]
                text-muted
              "
            >
              <span>
                CONTINUE THINKING
              </span>

              <span>
                CLARITY{" "}
                {
                  latest.clarity
                }
              </span>
            </div>

            <p
              className="
                mt-3
                font-serif
                text-lg
              "
            >
              {latest.title}
            </p>
          </button>
        ) : null}
      </section>

      <div
        className="
          border-t
          border-rule
          py-5
          text-center
          font-mono
          text-[9px]
          tracking-[0.18em]
          text-graphite
          md:text-[10px]
        "
      >
        DECISIONS · LEARNING ·
        WORK · CODE · WRITING ·
        ANYTHING
      </div>
    </main>
  );
}