import {
  History,
} from "lucide-react";

interface Props {
  xp: number;
  onHome: () => void;
  onHistory: () => void;
  onAbout: () => void;
}

export default function AppHeader({
  xp,
  onHome,
  onHistory,
  onAbout,
}: Props) {
  return (
    <>
      <header
        className="
          border-b
          border-line
          bg-paper
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-5
            py-4
            md:px-10
          "
        >
          <button
            className="
              font-mono
              text-xs
              text-muted
            "
            onClick={onHome}
          >
            16 / 30
          </button>

          <button
            className="
              font-serif
              text-lg
              uppercase
              tracking-tight
            "
            onClick={onHome}
          >
            FARTHER AWAY?
          </button>

          <div
            className="
              flex
              items-center
              gap-4
              text-[11px]
              font-semibold
              tracking-[0.08em]
              text-muted
            "
          >
            <button
              className="
                hidden
                hover:text-ink
                sm:inline
              "
              onClick={onAbout}
            >
              ABOUT
            </button>

            <span
              className="
                hidden
                font-mono
                text-[10px]
                text-cobalt
                md:inline
              "
            >
              XP {xp}/100
            </span>

            <button
              className="
                flex
                items-center
                gap-1
                hover:text-ink
              "
              onClick={onHistory}
            >
              <History size={13} />

              <span
                className="
                  hidden
                  sm:inline
                "
              >
                HISTORY
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className="
          h-1
          bg-paper-deep
        "
        aria-label={
          `${xp} insight XP out of 100`
        }
      >
        <div
          className="
            h-full
            bg-cobalt
            transition-all
            duration-500
          "
          style={{
            width: `${xp}%`,
          }}
        />
      </div>
    </>
  );
}