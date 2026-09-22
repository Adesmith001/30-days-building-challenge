"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

import { CameraDock } from "../controls/CameraDock";
import { CitySearch } from "../controls/CitySearch";
import { PhotoMode } from "../controls/PhotoMode";
import { RevealControl } from "../controls/RevealControl";
import { SceneSettings } from "../controls/SceneSettings";
import { TourButton } from "../controls/TourButton";
import { TourController } from "../controls/TourController";
import type { CityModel } from "@/types/city";
import type { GitHubYearSnapshot } from "@/types/github";
import { CityCanvas } from "./CityCanvas";
import { RevealClock } from "./RevealClock";
import { GhostSkyline } from "./GhostSkyline";
import { StreakLights } from "./StreakLights";
import { CityInspector } from "../ui/CityInspector";
import { CityStats } from "../ui/CityStats";

export function CityExperience({ snapshot, previousSnapshot, city }: { snapshot: GitHubYearSnapshot; previousSnapshot: GitHubYearSnapshot; city: CityModel }) {
  const busiestLot = snapshot.stats.busiestDay ? city.lots.find((lot) => lot.date === snapshot.stats.busiestDay?.date) ?? null : null;

  return (
    <main className="relative h-screen overflow-hidden bg-[#0b0d10]">
      <RevealClock />
      <TourController />
      <div className="absolute inset-0"><CityCanvas city={city} busiestLot={busiestLot} /></div>
      <header className="relative z-10 flex h-14 items-center justify-between border-b border-[var(--line)] bg-[#111419]/90 px-5 backdrop-blur-xl md:px-10">
        <Link href="/" className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.16em] text-[var(--muted)] hover:text-white"><ArrowLeft size={13} /> BACK TO INDEX</Link>
        <div className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--font-display)] tracking-[0.18em]">GITCITY</div>
        <a href={snapshot.profile.profileUrl} target="_blank" rel="noreferrer" className="hidden items-center gap-2 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.16em] text-[var(--mint)] sm:flex">GITHUB <ExternalLink size={12} /></a>
      </header>
      <div className="pointer-events-none relative z-10 mx-auto flex h-[calc(100vh-56px)] max-w-[1500px] flex-col justify-between p-4 md:p-8">
        <div className="pointer-events-auto grid gap-3 md:grid-cols-[minmax(0,1fr)_290px]">
          <div className="pointer-events-auto self-start"><CityStats snapshot={snapshot} /></div>
          <div className="pointer-events-auto"><CityInspector snapshot={snapshot} /></div>
        </div>
        <div className="pointer-events-none flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <RevealControl />
            <CameraDock />
            <PhotoMode />
            <TourButton />
          </div>
          <div className="flex flex-wrap gap-2">
            <CitySearch snapshot={snapshot} city={city} />
            <SceneSettings />
          </div>
        </div>
        <div className="flex items-end justify-between font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.16em] text-[var(--muted)]"><span>DRAG TO ORBIT · SCROLL TO ZOOM</span><span className="text-[var(--mint)]">{snapshot.year} / {city.lots.length} LOTS</span></div>
      </div>
    </main>
  );
}
