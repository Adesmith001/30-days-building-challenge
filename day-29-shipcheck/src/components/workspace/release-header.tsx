"use client";

import {
  History,
  Moon,
  RefreshCw,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import type { ReleaseSession } from "@/types/release";

export function ReleaseHeader({
  session,
}: {
  session: ReleaseSession;
}) {
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
  );

  function toggleTheme() {
    const next = !dark;

    setDark(next);
    document.documentElement.classList.toggle(
      "dark",
      next,
    );

    localStorage.setItem(
      "shipcheck-theme",
      next ? "dark" : "light",
    );
  }

  return (
    <header className="flex h-14 items-center border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex h-full w-52 shrink-0 items-center border-r border-neutral-200 px-4 dark:border-neutral-800">
        <Logo />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold">
            {session.repository}
          </p>

          <p className="truncate font-mono text-[9px] text-neutral-400">
            {session.source.prNumber
              ? `PR #${session.source.prNumber} · `
              : ""}
            {session.headSha?.slice(0, 7) ??
              "LOCAL DIFF"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Link href="/history">
            <Button
              variant="quiet"
              size="sm"
              aria-label="History"
            >
              <History size={15} />
            </Button>
          </Link>

          <Button
            variant="quiet"
            size="sm"
            aria-label="Refresh"
            onClick={() => location.reload()}
          >
            <RefreshCw size={15} />
          </Button>

          <Button
            variant="quiet"
            size="sm"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {dark ? (
              <Sun size={15} />
            ) : (
              <Moon size={15} />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}