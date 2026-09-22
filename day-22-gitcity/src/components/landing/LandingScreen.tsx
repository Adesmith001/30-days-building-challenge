/* eslint-disable @next/next/no-location-assign-relative-destination */
"use client";

import { ArrowRight, Github, Move3d } from "lucide-react";
import { FormEvent, useState } from "react";

export function LandingScreen() {
  const [username, setUsername] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const login = username.trim();

    if (login) {
      window.location.href = `/city/${encodeURIComponent(login)}`;
    }
  }

  return (
    <main className="technical-grid relative min-h-screen overflow-hidden">
      <div className="viewport-vignette pointer-events-none absolute inset-0" />
      <header className="relative z-10 flex h-16 items-center justify-between border-b border-[var(--line-soft)] px-6 md:px-12">
        <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--muted)]">
          22 / 30
        </div>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[var(--mint)] shadow-[0_0_12px_var(--mint)]" />
          <strong className="font-[family-name:var(--font-display)] tracking-[0.18em]">GITCITY</strong>
        </div>
        <div className="hidden font-[family-name:var(--font-mono)] text-[9px] tracking-[0.16em] text-[var(--steel)] sm:block">
          SYS.CAD READY
        </div>
      </header>

      <div className="pointer-events-none absolute left-6 top-24 hidden font-[family-name:var(--font-mono)] text-[8px] uppercase leading-5 tracking-[0.16em] text-[var(--steel)] md:block">
        <div className="text-[var(--mint)]">— PROJECTION // ORTHO-AXO 30°</div>
        <div>SCALE // VARIABLE</div>
      </div>

      <div className="pointer-events-none absolute right-6 top-24 hidden text-right font-[family-name:var(--font-mono)] text-[8px] uppercase leading-5 tracking-[0.16em] text-[var(--steel)] md:block">
        <div>SPEC.V1 // CITY ENGINE</div>
        <div>DETERMINISTIC GENERATOR</div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[56%] h-[540px] w-[820px] -translate-x-1/2 -translate-y-1/2 rotate-[30deg] skew-x-[-18deg] border border-[#1f252c] bg-[#0e1115]/40 shadow-[0_80px_120px_rgba(0,0,0,0.4)]">
        <div className="absolute left-1/2 top-0 h-full w-px bg-[#1c2228]" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-[#1c2228]" />
        <div className="absolute left-[14%] top-[18%] h-16 w-24 border border-[#20262d] bg-[#13171c]" />
        <div className="absolute right-[18%] top-[22%] h-24 w-32 border border-[#20262d] bg-[#15191e]" />
        <div className="absolute bottom-[18%] left-[20%] h-20 w-20 border border-[#20262d] bg-[#12161b]" />
        <div className="absolute bottom-[17%] right-[21%] h-28 w-24 border border-[#20262d] bg-[#161b20]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl flex-col items-center justify-center px-5 pb-20 pt-16 text-center">
        <div className="border border-[#353b42] bg-[#15191e] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.19em] text-[var(--gold)]">
          GITHUB → 3D CITY
        </div>
        <h1 className="mt-8 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
          TURN YOUR GITHUB
          <br />
          INTO A CITY.
        </h1>
        <p className="mt-7 max-w-2xl text-sm leading-6 text-[#aaa39a] sm:text-base">
          A year of commits, repositories and activity — rebuilt as an explorable 3D skyline.
        </p>
        <form onSubmit={submit} className="mt-10 flex w-full max-w-[650px] flex-col border border-[#353b42] bg-[#14171b] p-2 sm:flex-row">
          <label className="flex min-h-12 flex-1 items-center border border-[#252c33] bg-[#0d1013] px-4">
            <Github size={14} className="mr-2 text-[var(--muted)]" />
            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[#80776c]">github.com/</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="off" placeholder="username" className="min-w-0 flex-1 bg-transparent px-2 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.12em] text-white outline-none placeholder:text-[#514b45]" />
          </label>
          <button type="submit" className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 border border-[#46515c] bg-[#22272f] px-6 font-[family-name:var(--font-mono)] text-[10px] font-medium tracking-[0.16em] text-[var(--mint)] transition hover:border-[var(--mint)] sm:ml-2 sm:mt-0">
            BUILD CITY
            <ArrowRight size={13} strokeWidth={1.5} />
          </button>
        </form>
        <div className="mt-5 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.18em] text-[#746e66]">
          <Move3d size={11} /> PUBLIC DATA · SHAREABLE CITY · NO GITHUB WRITE ACCESS
        </div>
      </section>
    </main>
  );
}
