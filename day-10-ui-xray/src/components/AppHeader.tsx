import {
  Download,
  History,
} from "lucide-react";

interface Props {
  canExport: boolean;
  onHome: () => void;
  onHistory: () => void;
  onExport: () => void;
}

export function AppHeader({
  canExport,
  onHome,
  onHistory,
  onExport,
}: Props) {
  return (
    <header className="relative z-50 flex h-11 shrink-0 items-center justify-between border-b border-line bg-canvas px-4">
      <button
        onClick={onHome}
        className="flex items-center gap-2 font-mono text-[11px] font-semibold"
      >
        <span>10 / 30</span>

        <span className="size-1.5 bg-accent" />
      </button>

      <button
        onClick={onHome}
        className="absolute left-1/2 -translate-x-1/2 font-sans text-xs font-bold tracking-[0.16em]"
      >
        UI X-RAY
      </button>

      <div className="flex items-center gap-1">
        <button
          onClick={onHistory}
          className="flex h-8 items-center gap-2 border border-transparent px-2 font-mono text-[10px] text-muted hover:border-line hover:bg-panel hover:text-ink"
        >
          <History size={13} />

          <span className="hidden sm:inline">
            X-RAYS
          </span>
        </button>

        {canExport && (
          <button
            onClick={onExport}
            className="flex h-8 items-center gap-2 bg-ink px-3 font-mono text-[10px] font-semibold text-white hover:bg-accent"
          >
            <Download size={13} />

            EXPORT
          </button>
        )}
      </div>
    </header>
  );
}