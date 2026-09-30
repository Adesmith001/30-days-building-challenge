import Link from "next/link";
import {
  ArrowRight,
  CornerDownRight,
} from "lucide-react";

export default function LandingPage() {
  const source =
    process.env.NEXT_PUBLIC_SOURCE_URL ?? "#";

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <header className="grid h-20 grid-cols-3 items-center border-b px-5 text-[11px] font-semibold uppercase tracking-[0.22em] md:px-9">
        <span>30 / 30</span>

        <span className="text-center">
          Deep Work OS
        </span>

        <div className="flex justify-end gap-5">
          <Link
            href="/about"
            className="hidden sm:inline"
          >
            About
          </Link>

          <a href={source}>
            Source ↗
          </a>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-[1500px] flex-col justify-between px-5 pb-6 pt-10 md:px-9 md:pb-9 md:pt-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              One thing.
            </p>

            <h1 className="editorial max-w-5xl text-[clamp(4.5rem,11vw,11rem)] font-normal leading-[0.76]">
              Protect
              <br />
              the work.
            </h1>
          </div>

          <aside className="self-end border-t pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="max-w-sm text-lg leading-7">
              Define one outcome.
              <br />
              Clear the noise.
              <br />
              Stay with it until the session ends.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/new"
                className="group flex items-center justify-between bg-[var(--foreground)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--background)]"
              >
                Start deep work
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/about"
                className="flex items-center gap-2 px-1 py-3 text-xs font-semibold uppercase tracking-[0.17em]"
              >
                <CornerDownRight size={14} />
                See how it works
              </Link>
            </div>
          </aside>
        </div>

        <div>
          <div className="mb-6 grid border-y py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] sm:grid-cols-3">
            <span>Local-first</span>
            <span className="sm:text-center">
              Offline-ready
            </span>
            <span className="sm:text-right">
              No productivity score
            </span>
          </div>

          <div className="grid gap-px bg-[var(--line)] lg:grid-cols-4">
            {[
              ["01", "DEFINE", "One outcome."],
              [
                "02",
                "FOCUS",
                "Keep the next action visible.",
              ],
              [
                "03",
                "RETURN",
                "Restore context after interruption.",
              ],
              [
                "04",
                "REVIEW",
                "See what actually happened.",
              ],
            ].map(([n, title, copy]) => (
              <div
                key={n}
                className="bg-[var(--background)] p-5"
              >
                <span className="mono text-[10px] text-[var(--muted)]">
                  {n}
                </span>

                <p className="mt-10 text-xs font-bold tracking-[0.18em]">
                  {title}
                </p>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}