"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CalendarDays,
  Folder,
  History,
  Home,
  Settings,
  Shapes,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SyncStatus } from "./sync-status";
import { CommandPalette } from "./command-palette";

const navigation = [
  {
    href: "/home",
    label: "Home",
    icon: Home,
  },
  {
    href: "/today",
    label: "Today",
    icon: CalendarDays,
  },
  {
    href: "/sessions",
    label: "Sessions",
    icon: History,
  },
  {
    href: "/projects",
    label: "Projects",
    icon: Folder,
  },
  {
    href: "/patterns",
    label: "Patterns",
    icon: Shapes,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r md:flex md:flex-col">
        <Link
          href="/home"
          className="flex h-20 items-center border-b px-6 text-xs font-bold uppercase tracking-[0.2em]"
        >
          Deep Work OS
        </Link>

        <nav className="flex flex-1 flex-col gap-1 p-3 pt-6">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`,
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.13em] transition",
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]",
                )}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-5">
          <SyncStatus />
        </div>
      </aside>

      <div className="pb-20 md:ml-60 md:pb-0">
        {children}
      </div>

      <CommandPalette />

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-[var(--background)] md:hidden">
        {navigation.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-16 flex-col items-center justify-center gap-1 text-[9px] font-semibold uppercase tracking-[0.08em]",
                active
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)]",
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
