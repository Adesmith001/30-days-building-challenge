export default function AboutScreen() {
  return (
    <main
      className="
        mx-auto
        max-w-4xl
        px-5
        py-12
        md:px-10
        md:py-16
      "
    >
      <p
        className="
          font-mono
          text-xs
          text-muted
        "
      >
        METHODOLOGY // DAY 16
      </p>

      <h1
        className="
          mt-4
          font-serif
          text-5xl
        "
      >
        WHAT THIS TOOL DOES.
      </h1>

      <div
        className="
          mt-10
          space-y-8
          text-sm
          leading-7
          text-muted
        "
      >
        <section
          className="
            border-t
            border-line
            pt-5
          "
        >
          <h2
            className="
              font-serif
              text-2xl
              text-ink
            "
          >
            Cash stays cash.
          </h2>

          <p className="mt-2">
            Annual cash cost is
            annual rent plus
            round-trip transport
            for the commute days
            you enter. Personal
            time is not monetised
            unless you explicitly
            turn on Value My Time.
          </p>
        </section>

        <section
          className="
            border-t
            border-line
            pt-5
          "
        >
          <h2
            className="
              font-serif
              text-2xl
              text-ink
            "
          >
            Time stays visible.
          </h2>

          <p className="mt-2">
            Commute minutes are
            converted into weekly
            hours, annual hours
            and 24-hour day
            equivalents. These
            are equivalents, not
            literal days away
            from work.
          </p>
        </section>

        <section
          className="
            border-t
            border-line
            pt-5
          "
        >
          <h2
            className="
              font-serif
              text-2xl
              text-ink
            "
          >
            No recommendation
            engine.
          </h2>

          <p className="mt-2">
            Farther Away? is a
            comparison and
            exploration tool.
            Estimates depend
            entirely on your
            inputs and do not
            account for every
            housing, transport
            or lifestyle factor.
            It does not provide
            financial advice or
            tell you where to
            live.
          </p>
        </section>
      </div>
    </main>
  );
}