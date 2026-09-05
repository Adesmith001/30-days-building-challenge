import { ArrowUpRight } from "lucide-react";
import { SOURCE_URL } from "../lib/constants";

interface Props {
  layout?: "intro" | "game";
}

export function Header({ layout = "game" }: Props) {
  const about = () => {
    window.alert(
      "Catch the button. Ten levels. It gets increasingly unreasonable.",
    );
  };

  if (layout === "intro") {
    return (
      <header className="relative flex h-16 items-center border-b border-[#d5d7df] px-6 font-mono text-[12px] tracking-[0.12em] md:px-7">
        <div className="flex-1 text-[#343746]">
          05 / 30
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 font-sans text-[17px] font-black tracking-[0.16em] text-[#171717]">
          DO NOT TOUCH
        </div>

        <nav className="ml-auto flex items-center gap-6">
          <button
            onClick={about}
            className="hidden hover:text-[#1248ff] sm:block"
          >
            ABOUT
          </button>

          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-[#1248ff]"
          >
            SOURCE
            <ArrowUpRight size={13} />
          </a>
        </nav>
      </header>
    );
  }

  return (
    <header className="flex h-16 items-center border-b border-[#d5d7df] px-6 md:px-7">
      <div className="flex-1 font-sans text-[17px] font-black tracking-[0.16em]">
        DO NOT TOUCH
      </div>

      <nav className="hidden items-center gap-7 font-mono text-[12px] tracking-[0.12em] md:flex">
        <button
          onClick={about}
          className="hover:text-[#1248ff]"
        >
          ABOUT
        </button>

        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:text-[#1248ff]"
        >
          SOURCE
          <ArrowUpRight size={13} />
        </a>
      </nav>

      <div className="flex-1 text-right font-mono text-[12px] tracking-[0.14em]">
        05 / 30
      </div>
    </header>
  );
}