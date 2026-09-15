interface Props {
  onAbout: () => void
  month?: number
  rentPercent?: number
  score?: number
}

export function GameHeader({
  onAbout,
  month,
  rentPercent,
  score,
}: Props) {
  const sourceUrl =
    import.meta.env.VITE_SOURCE_URL as string | undefined

  const gameplay =
    month !== undefined &&
    rentPercent !== undefined &&
    score !== undefined

  return (
    <header className="sticky top-0 z-50 bg-paper">
      <div className="border-b border-rule">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5 md:px-12">
          <span className="font-mono text-[11px] tracking-[0.14em]">
            15 / 30
          </span>

          <span className="absolute left-1/2 -translate-x-1/2 font-mono text-sm font-medium tracking-[0.3em] md:text-xl">
            RENT IS LAVA
          </span>

          <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.13em] md:gap-6">
            <button
              type="button"
              onClick={onAbout}
              className="transition-opacity hover:opacity-50"
            >
              ABOUT
            </button>

            <span className="hidden text-muted sm:inline">
              ·
            </span>

            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden transition-opacity hover:opacity-50 sm:inline"
              >
                SOURCE ↗
              </a>
            ) : (
              <span className="hidden text-muted sm:inline">
                SOURCE ↗
              </span>
            )}
          </div>
        </div>
      </div>

      {gameplay && (
        <div className="border-b border-rule bg-paper-soft">
          <div className="mx-auto grid h-10 max-w-[1200px] grid-cols-3 items-center px-5 font-mono text-[9px] tracking-[0.13em] md:px-12 md:text-[10px]">
            <span>
              ■ MONTH {String(month).padStart(2, "0")} / 12
            </span>

            <span className="text-center text-orange">
              ■ RENT {Math.round(rentPercent)}%
            </span>

            <span className="text-right">
              SCORE {score.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </header>
  )
}