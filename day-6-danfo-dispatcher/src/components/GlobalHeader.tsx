import {
  ExternalLink,
} from "lucide-react";
import {
  DAY_NUMBER,
  PRODUCT_NAME,
  SOURCE_URL,
} from "../data/meta";

interface Props {
  onAbout(): void;
  status?: string;
}

export function GlobalHeader({
  onAbout,
  status,
}: Props) {
  return (
    <header
      className="
        grid min-h-14 grid-cols-[1fr_auto_1fr]
        items-center border-b border-[#8f8877]
        bg-[#f7f4ef] px-4 text-xs
        sm:px-6
      "
    >
      <div className="flex items-center gap-3 tracking-[0.15em]">
        <span>{DAY_NUMBER}</span>

        {status && (
          <>
            <span className="size-2 rounded-full bg-[#386b54]" />
            <span className="hidden uppercase sm:inline">
              {status}
            </span>
          </>
        )}
      </div>

      <div
        className="
          text-center text-sm font-black
          tracking-[0.08em] sm:text-lg
        "
      >
        {PRODUCT_NAME}
      </div>

      <nav className="flex justify-end gap-5">
        <button
          onClick={onAbout}
          className="cursor-pointer hover:underline"
        >
          ABOUT
        </button>

        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noreferrer"
          className="
            flex items-center gap-1
            hover:underline
          "
        >
          SOURCE
          <ExternalLink size={11} />
        </a>
      </nav>
    </header>
  );
}