import {
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  showNewDump?: boolean;
  historyActive?: boolean;
}

export function AppHeader({
  showNewDump = false,
  historyActive = false,
}: AppHeaderProps) {
  return (
    <header className="w-full border-b border-line/80">
      <div className="mx-auto flex h-[64px] w-full max-w-[900px] items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="text-[20px] font-medium tracking-[-0.02em] text-ink"
        >
          Untangle
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/history"
            className={
              historyActive
                ? "text-sm font-medium text-ink"
                : "text-sm text-muted transition-colors hover:text-ink"
            }
          >
            History
          </Link>

          {showNewDump && (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-dark/70 bg-panel px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-soft"
            >
              <Plus size={15} strokeWidth={1.8} />
              New dump
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}