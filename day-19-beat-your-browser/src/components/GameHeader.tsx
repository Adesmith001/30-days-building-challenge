interface Props {
  active?:
    | "experiment"
    | "lab"
    | "history"
    | "about";

  onNavigate:
    (
      screen:
        | "home"
        | "lab"
        | "history"
        | "about",
    ) => void;

  onReset:
    () => void;

  sourceUrl?:
    string;
}

export function GameHeader({
  active = "experiment",
  onNavigate,
  onReset,
  sourceUrl,
}: Props) {
  const navClass = (
    key:
      Props["active"],
  ) =>
    `
      border-b-2
      pb-1
      text-[10px]
      font-semibold
      tracking-[.12em]
      ${
        active === key
          ? "border-lime text-lime"
          : "border-transparent text-muted hover:text-ink"
      }
    `;

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-line
        bg-canvas/95
        backdrop-blur
      "
    >
      <div
        className="
          mx-auto
          flex
          h-14
          max-w-7xl
          items-center
          justify-between
          px-4
          md:px-6
        "
      >
        <button
          onClick={() =>
            onNavigate(
              "home",
            )
          }
          className="
            flex
            items-center
            gap-3
            text-left
          "
        >
          <span
            className="
              h-2.5
              w-2.5
              bg-lime
            "
          />

          <span
            className="
              text-sm
              font-semibold
              tracking-tight
              md:text-base
            "
          >
            BEAT YOUR BROWSER
          </span>

          <span
            className="
              hidden
              font-mono
              text-[10px]
              text-dim
              sm:inline
            "
          >
            19 / 30
          </span>
        </button>

        <nav
          className="
            hidden
            items-center
            gap-5
            md:flex
          "
        >
          <button
            className={
              navClass(
                "experiment",
              )
            }
            onClick={() =>
              onNavigate(
                "home",
              )
            }
          >
            EXPERIMENT
          </button>

          <button
            className={
              navClass(
                "lab",
              )
            }
            onClick={() =>
              onNavigate(
                "lab",
              )
            }
          >
            LAB
          </button>

          <button
            className={
              navClass(
                "history",
              )
            }
            onClick={() =>
              onNavigate(
                "history",
              )
            }
          >
            RUNS
          </button>

          <button
            className={
              navClass(
                "about",
              )
            }
            onClick={() =>
              onNavigate(
                "about",
              )
            }
          >
            ABOUT
          </button>

          {sourceUrl && (
            <a
              className="
                border-b-2
                border-transparent
                pb-1
                text-[10px]
                font-semibold
                tracking-[.12em]
                text-muted
                hover:text-ink
              "
              href={
                sourceUrl
              }
              target="_blank"
              rel="noreferrer"
            >
              SOURCE ↗
            </a>
          )}
        </nav>

        <button
          onClick={
            onReset
          }
          className="
            border
            border-line
            bg-cell
            px-3
            py-1.5
            font-mono
            text-[10px]
            text-muted
            transition
            hover:border-muted
            hover:text-ink
            active:translate-y-px
          "
        >
          RESET
        </button>
      </div>
    </header>
  );
}