"use client";

import { ExternalLink, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { CityModel } from "@/types/city";
import type { GitHubYearSnapshot } from "@/types/github";
import { CameraDock } from "../controls/CameraDock";
import { CitySearch } from "../controls/CitySearch";
import { RevealControl } from "../controls/RevealControl";
import { SceneSettings } from "../controls/SceneSettings";
import { CityInspector } from "../ui/CityInspector";
import { CityStats } from "../ui/CityStats";

export function MobileCityMenu({ snapshot, city }: { snapshot: GitHubYearSnapshot; city: CityModel }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const trigger = menuButton.current;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button ref={menuButton} type="button" aria-label="Open city menu" aria-expanded={open} aria-controls="mobile-city-menu" onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center border border-[var(--line)] bg-[#111419] text-[var(--mint)] active:translate-y-px">
        <Menu size={18} strokeWidth={1.5} />
      </button>

      <div className={`fixed inset-0 z-30 transition-opacity duration-200 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!open} inert={!open}>
        <button type="button" aria-label="Close city menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-[#050709]/75 backdrop-blur-sm" />
        <aside id="mobile-city-menu" role="dialog" aria-modal="true" aria-label="City information and controls" className={`absolute inset-y-0 right-0 flex w-[min(92vw,390px)] flex-col border-l border-[var(--line)] bg-[#0b0d10] shadow-[-24px_0_60px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line)] px-4">
            <div>
              <div className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.18em] text-[var(--muted)]">CITY INTERFACE</div>
              <div className="mt-0.5 font-[family-name:var(--font-display)] text-sm tracking-[0.12em] text-white">{snapshot.login.toUpperCase()}</div>
            </div>
            <button ref={closeButton} type="button" aria-label="Close city menu" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center border border-[var(--line)] text-[var(--muted)] hover:text-white active:translate-y-px">
              <X size={17} strokeWidth={1.5} />
            </button>
          </div>

          <div className="h-full flex-1 space-y-3 overflow-y-auto p-4 pb-8">
            <CityStats snapshot={snapshot} />
            <CityInspector snapshot={snapshot} />

            <section className="border border-[var(--line)] bg-[#111419]/95 p-3">
              <div className="mb-3 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.18em] text-[var(--mint)]">EXPLORE CITY</div>
              <div className="space-y-2">
                <RevealControl onStart={() => setOpen(false)} />
                <CameraDock showLabels onNavigate={() => setOpen(false)} />
                <CitySearch snapshot={snapshot} city={city} onSelect={() => setOpen(false)} />
                <SceneSettings mobile />
              </div>
            </section>

            <a href={snapshot.profile.profileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between border border-[var(--line)] bg-[#111419]/95 px-4 py-3 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.14em] text-[var(--mint)] active:translate-y-px">
              VIEW ON GITHUB <ExternalLink size={13} strokeWidth={1.5} />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
