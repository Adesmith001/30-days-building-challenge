interface Props {
  onAbout: () => void;
  onHistory: () => void;
}

export function Header({
  onAbout,
  onHistory,
}: Props) {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-black/20 px-5 md:px-12">
      <div className="flex items-center gap-8">
        <span className="hidden font-mono text-[10px] font-semibold tracking-[0.15em] text-neutral-500 md:block">
          02 / 30
        </span>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-xl font-bold tracking-[-0.05em] md:text-2xl"
        >
          MEETING COST
        </button>
      </div>

      <nav className="flex items-center gap-5 font-mono text-[10px] font-semibold tracking-[0.12em] md:gap-9">
        <button
          type="button"
          onClick={onHistory}
          className="hidden hover:underline md:block"
        >
          HISTORY
        </button>

        <button
          type="button"
          onClick={onAbout}
          className="hover:underline"
        >
          ABOUT
        </button>

        <a
          href="https://github.com/Adesmith001/30-days-building"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          SOURCE ↗
        </a>
      </nav>
    </header>
  );
}