interface Props {
  onHome: () => void;
  onThreads: () => void;
  onAbout: () => void;
}

export function AppHeader({
  onHome,
  onThreads,
  onAbout,
}: Props) {
  const source =
    import.meta.env
      .VITE_SOURCE_URL as
      | string
      | undefined;

  return (
    <header
      className="
        border-b border-rule
        bg-paper
        px-5 py-4
        md:px-8
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-[1400px]
          grid-cols-[1fr_auto_1fr]
          items-center
          gap-4
        "
      >
        <button
          onClick={onHome}
          className="
            justify-self-start
            border-b
            border-ink
            pb-0.5
            font-mono
            text-[10px]
            tracking-[0.18em]
            md:text-xs
          "
        >
          DAY 08 / 30
        </button>

        <button
          onClick={onHome}
          className="
            font-serif
            text-xl
            font-medium
            tracking-[0.08em]
            md:text-2xl
          "
        >
          RUBBER DUCK
        </button>

        <nav
          className="
            flex
            items-center
            justify-self-end
            gap-3
            font-mono
            text-[9px]
            tracking-[0.14em]
            md:gap-6
            md:text-[11px]
          "
        >
          <button
            onClick={onThreads}
            className="hover:underline"
          >
            THREADS
          </button>

          <button
            onClick={onAbout}
            className="
              hidden
              hover:underline
              sm:block
            "
          >
            ABOUT
          </button>

          {source ? (
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              className="
                hidden
                hover:underline
                md:block
              "
            >
              SOURCE ↗
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}