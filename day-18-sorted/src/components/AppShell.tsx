import type {
  ReactNode,
} from "react";

interface Props {
  children: ReactNode;
  active?:
    | "play"
    | "daily"
    | "history";
  onNavigate?: (
    target:
      | "home"
      | "daily"
      | "history",
  ) => void;
  hideNav?: boolean;
}

export function AppShell({
  children,
  active,
  onNavigate,
  hideNav,
}: Props) {
  return (
    <div
      className="
        mx-auto
        flex
        min-h-screen
        w-full
        max-w-[720px]
        flex-col
        px-3
        sm:px-6
      "
    >
      <header
        className="
          sticky
          top-0
          z-40
          flex
          items-center
          justify-between
          border-b
          border-white/10
          bg-night/90
          py-4
          backdrop-blur
        "
      >
        <span
          className="
            rounded-md
            border
            border-white/10
            bg-white/5
            px-2
            py-1
            font-display
            text-xs
            font-bold
            text-amber-200
          "
        >
          18 / 30
        </span>

        <button
          onClick={() =>
            onNavigate?.(
              "home",
            )
          }
          className="
            font-display
            text-xl
            font-bold
            tracking-tight
            text-gold
          "
        >
          SORTED.
        </button>

        <span
          className="
            text-right
            font-display
            text-[11px]
            font-semibold
            text-slate-400
          "
        >
          4 THINGS.
          1 ORDER.
        </span>
      </header>

      <main
        className="
          mx-auto
          flex
          w-full
          max-w-[520px]
          flex-1
          flex-col
          py-5
        "
      >
        {children}
      </main>

      {!hideNav &&
        onNavigate && (
          <nav
            className="
              sticky
              bottom-0
              z-40
              grid
              grid-cols-3
              border-t
              border-white/10
              bg-night/95
              py-2
              backdrop-blur
            "
          >
            {[
              [
                "play",
                "PLAY",
                "home",
              ],
              [
                "daily",
                "DAILY",
                "daily",
              ],
              [
                "history",
                "RUNS",
                "history",
              ],
            ].map(
              ([
                key,
                label,
                target,
              ]) => (
                <button
                  key={key}
                  onClick={() =>
                    onNavigate(
                      target as
                        | "home"
                        | "daily"
                        | "history",
                    )
                  }
                  className={`
                    rounded-xl
                    py-2
                    font-display
                    text-xs
                    font-bold
                    tracking-wider
                    transition
                    ${
                      active ===
                      key
                        ? `
                          bg-white/10
                          text-gold
                        `
                        : `
                          text-slate-400
                          hover:text-white
                        `
                    }
                  `}
                >
                  {label}
                </button>
              ),
            )}
          </nav>
        )}
    </div>
  );
}