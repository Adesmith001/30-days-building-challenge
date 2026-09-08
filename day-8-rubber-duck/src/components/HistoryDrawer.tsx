import type {
  DuckSession,
} from "../schemas/session";

interface Props {
  open: boolean;

  sessions:
    DuckSession[];

  onClose:
    () => void;

  onOpen:
    (
      id: string,
    ) => void;

  onDelete:
    (
      id: string,
    ) => void;
}

export function HistoryDrawer({
  open,
  sessions,
  onClose,
  onOpen,
  onDelete,
}: Props) {
  return (
    <div
      className={`
        fixed
        inset-0
        z-40

        ${
          open
            ? "pointer-events-auto"
            : "pointer-events-none"
        }
      `}
    >
      <button
        aria-label="Close history"
        onClick={onClose}
        className={`
          absolute
          inset-0
          bg-black/20
          transition-opacity

          ${
            open
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      <aside
        className={`
          absolute
          right-0
          top-0
          h-full
          w-full
          max-w-md
          border-l
          border-ink
          bg-paper
          p-6
          transition-transform
          duration-300

          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-rule
            pb-5
          "
        >
          <div>
            <p
              className="
                font-mono
                text-[9px]
                tracking-[0.17em]
                text-muted
              "
            >
              LOCAL ARCHIVE
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-3xl
              "
            >
              YOUR THREADS
            </h2>
          </div>

          <button
            onClick={
              onClose
            }
            className="
              font-mono
              text-[10px]
              tracking-[0.15em]
            "
          >
            CLOSE ×
          </button>
        </div>

        <div
          className="
            mt-2
            h-[calc(100%-90px)]
            overflow-y-auto
          "
        >
          {sessions.length ? (
            sessions.map(
              (session) => (
                <article
                  key={
                    session.id
                  }
                  className="
                    border-b
                    border-rule
                    py-6
                  "
                >
                  <div
                    className="
                      mb-3
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
                      {new Date(
                        session.updatedAt,
                      )
                        .toLocaleDateString(
                          undefined,
                          {
                            month:
                              "short",

                            day:
                              "2-digit",
                          },
                        )
                        .toUpperCase()}
                    </span>

                    <span>
                      {session.status.toUpperCase()}
                      {" · "}
                      CLARITY{" "}
                      {
                        session.clarity
                      }
                    </span>
                  </div>

                  <h3
                    className="
                      font-serif
                      text-xl
                      leading-7
                    "
                  >
                    {session.title}
                  </h3>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-5
                      font-mono
                      text-[9px]
                      tracking-[0.13em]
                    "
                  >
                    <button
                      onClick={() =>
                        onOpen(
                          session.id,
                        )
                      }
                      className="
                        border-b
                        border-ink
                        pb-1
                      "
                    >
                      {session.status ===
                      "resolved"
                        ? "REVIEW"
                        : "RESUME"}{" "}
                      →
                    </button>

                    <button
                      onClick={() =>
                        onDelete(
                          session.id,
                        )
                      }
                      className="
                        text-muted
                        hover:text-ink
                      "
                    >
                      DELETE
                    </button>
                  </div>
                </article>
              ),
            )
          ) : (
            <div
              className="
                py-12
                text-center
              "
            >
              <p
                className="
                  font-serif
                  text-xl
                "
              >
                No threads yet.
              </p>

              <p
                className="
                  mt-2
                  font-serif
                  text-sm
                  italic
                  text-muted
                "
              >
                Start with one
                thing you&apos;re
                stuck on.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}