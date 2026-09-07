interface Props {
  onAbout: () => void;
  onHome: () => void;
}

export function Header({
  onAbout,
  onHome,
}: Props) {
  return (
    <header className="mx-auto w-full max-w-[920px] px-5">
      <div
        className="
          grid h-[60px] grid-cols-3 items-center
          border-b border-[#bdc7bd]
        "
      >
        <button
          onClick={onHome}
          className="
            justify-self-start font-mono text-xs
            font-bold tracking-[0.18em]
          "
        >
          07 / 30
        </button>

        <button
          onClick={onHome}
          className="
            justify-self-center text-xl font-black
            tracking-[0.05em] sm:text-2xl
          "
        >
          PRICE AM
        </button>

        <div
          className="
            flex items-center gap-3 justify-self-end
            font-mono text-[10px] font-bold
            tracking-[0.14em] sm:text-xs
          "
        >
          <button onClick={onAbout}>
            ABOUT
          </button>

          <span className="text-[#b6bdb7]">·</span>

          <a
            href="https://nigerianstat.gov.ng/"
            target="_blank"
            rel="noreferrer"
            className="text-[#075d38]"
          >
            SOURCE ↗
          </a>
        </div>
      </div>
    </header>
  );
}