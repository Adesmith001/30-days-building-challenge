import Link from "next/link";

export default function OfflinePage() {
  return <main className="grid min-h-dvh place-items-center p-6 text-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Offline</p><h1 className="editorial mt-5 text-7xl leading-none">The network can wait.</h1><p className="mx-auto mt-6 max-w-md text-sm text-[var(--muted)]">Your local sessions remain available. Return to the app and keep working.</p><Link href="/home" className="mt-8 inline-block border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em]">Go home</Link></div></main>;
}
