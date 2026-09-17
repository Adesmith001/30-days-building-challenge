import {
  BarChart3,
  CircleHelp,
} from "lucide-react";

type Props = {
  onHome: () => void;
  onHowTo: () => void;
  onStats: () => void;
};

export function Header({
  onHome,
  onHowTo,
  onStats,
}: Props) {
  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-[#d9d2c8]
        bg-[#fbf7f2]/95
        backdrop-blur-sm
      "
    >
      <div
        className="
          mx-auto grid h-14
          w-full max-w-7xl
          grid-cols-3
          items-center
          px-4 sm:px-8
        "
      >
        <button
          onClick={onHome}
          className="
            justify-self-start
            font-mono text-[11px]
            tracking-[0.16em]
            text-[#625f5a]
            hover:text-[#111]
          "
        >
          17 / 30
        </button>

        <button
          onClick={onHome}
          className="
            justify-self-center
            font-serif text-lg
            tracking-[0.18em]
            text-[#111]
            sm:text-2xl
          "
        >
          SABI SEARCH
        </button>

        <nav
          className="
            flex items-center
            justify-self-end
            gap-2 sm:gap-4
          "
        >
          <button
            onClick={onHowTo}
            aria-label="How to play"
            className="
              p-2
              text-[#625f5a]
              hover:text-[#111]
            "
          >
            <CircleHelp
              size={18}
              strokeWidth={1.6}
            />
          </button>

          <button
            onClick={onStats}
            aria-label="Stats"
            className="
              p-2
              text-[#625f5a]
              hover:text-[#111]
            "
          >
            <BarChart3
              size={18}
              strokeWidth={1.6}
            />
          </button>
        </nav>
      </div>
    </header>
  );
}