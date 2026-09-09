import type {
  DuckSession,
} from "../schemas/session";

export function SessionHUD({
  session,
}: {
  session: DuckSession;
}) {
  return (
    <div
      className="
        border-b
        border-rule
        bg-wash/55
        px-5
        py-2.5
        md:px-8
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-[1400px]
          items-center
          justify-between
          gap-4
          font-mono
          text-[9px]
          tracking-[0.14em]
          text-graphite
          md:text-[11px]
        "
      >
        <span className="uppercase">
          STAGE : {session.stage}
        </span>

        <span className="text-center">
          <span className="text-muted">
            CLARITY{" "}
          </span>

          <span
            className="
              font-semibold
              text-ink
            "
          >
            {session.clarity}
          </span>

          {session.previousClarity !==
            undefined &&
          session.previousClarity !==
            session.clarity ? (
            <span
              className="
                hidden
                text-muted
                sm:inline
              "
            >
              {" "}
              /{" "}
              {
                session.previousClarity
              }{" "}
              →{" "}
              {session.clarity}
            </span>
          ) : null}
        </span>

        <span>
          HINT {session.hintLevel} / 3
        </span>
      </div>
    </div>
  );
}