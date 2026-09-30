import Link from "next/link";

export default function AboutPage() {
  return <main className="min-h-dvh p-5 md:p-10 lg:p-14"><Link href="/" className="text-[10px] font-bold uppercase tracking-[0.18em]">Deep Work OS</Link><div className="mx-auto max-w-4xl pt-24"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Day 30 / 30</p><h1 className="editorial mt-5 text-7xl leading-none md:text-9xl">Protect the work.</h1><p className="mt-10 max-w-2xl text-xl leading-relaxed text-[var(--muted)]">Deep Work OS is an offline-first focus environment built around context preservation, not productivity scoring. The session is the domain object: intent, next action, checkpoints, interruptions, and re-entry.</p><Link href="/new" className="mt-10 inline-block bg-[var(--foreground)] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--background)]">Start a session</Link></div></main>;
}
