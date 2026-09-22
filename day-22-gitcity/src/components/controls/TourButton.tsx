"use client";

import { Film } from "lucide-react";

import { sceneStore, useSceneStore } from "@/stores/scene-store";

export function TourButton() {
  const active = useSceneStore((value) => value.tourActive);

  return (
    <button type="button" onClick={() => sceneStore.setTourActive(!active)} className={`pointer-events-auto flex items-center gap-2 border px-3 py-2 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] ${active ? "border-[var(--gold)] text-[var(--gold)]" : "border-[var(--line)] bg-[#111419]/95 text-[var(--muted)]"}`}>
      <Film size={12} /> {active ? "STOP TOUR" : "AUTO TOUR"}
    </button>
  );
}
