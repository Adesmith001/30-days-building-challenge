"use client";

import { SlidersHorizontal } from "lucide-react";

import { getSceneTheme, listSceneThemes } from "@/lib/city/themes";
import { sceneStore, useSceneStore } from "@/stores/scene-store";
import { temporalStore, useTemporalStore } from "@/stores/temporal-store";

export function SceneSettings() {
  const themeName = useSceneStore((value) => value.theme);
  const quality = useSceneStore((value) => value.quality);
  const ghost = useTemporalStore((value) => value.layers.ghost);
  const streaks = useTemporalStore((value) => value.layers.streaks);
  const differences = useTemporalStore((value) => value.layers.differences);
  const yearShift = useTemporalStore((value) => value.yearShift);
  const theme = getSceneTheme(themeName);

  return (
    <details className="pointer-events-auto relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 border border-[var(--line)] bg-[#111419]/95 px-3 py-2 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-[var(--muted)] hover:text-white">
        <SlidersHorizontal size={12} /> SCENE SETTINGS
      </summary>
      <div className="absolute right-0 top-10 z-20 w-56 border border-[var(--line)] bg-[#111419] p-3 shadow-2xl">
        <label className="block font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-[var(--muted)]">THEME</label>
        <select value={themeName} onChange={(event) => sceneStore.setTheme(event.target.value as typeof themeName)} className="mt-2 w-full border border-[var(--line)] bg-[#0b0d10] px-2 py-2 font-[family-name:var(--font-mono)] text-[9px] text-white outline-none" style={{ color: theme.accent }}>
          {listSceneThemes().map((option) => <option key={option.name} value={option.name}>{option.name.toUpperCase()}</option>)}
        </select>
        <label className="mt-4 block font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-[var(--muted)]">QUALITY</label>
        <select value={quality} onChange={(event) => sceneStore.setQuality(event.target.value as typeof quality)} className="mt-2 w-full border border-[var(--line)] bg-[#0b0d10] px-2 py-2 font-[family-name:var(--font-mono)] text-[9px] text-white outline-none">
          <option value="high">HIGH</option>
          <option value="balanced">BALANCED</option>
          <option value="low">LOW</option>
        </select>
        <label className="mt-4 block font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-[var(--muted)]">TEMPORAL LAYERS</label>
        <div className="mt-2 space-y-2 font-[family-name:var(--font-mono)] text-[9px] text-white">
          <label className="flex items-center justify-between"><span>GHOST SKYLINE</span><input type="checkbox" checked={ghost} onChange={() => temporalStore.toggleLayer("ghost")} /></label>
          <label className="flex items-center justify-between"><span>STREAK LIGHTS</span><input type="checkbox" checked={streaks} onChange={() => temporalStore.toggleLayer("streaks")} /></label>
          <label className="flex items-center justify-between"><span>DIFFERENCES</span><input type="checkbox" checked={differences} onChange={() => temporalStore.toggleLayer("differences")} /></label>
        </div>
        <label className="mt-4 block font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-[var(--muted)]">YEAR SHIFT</label>
        <input type="range" min="0" max="1" step="0.01" value={yearShift} onChange={(event) => temporalStore.setYearShift(Number(event.target.value))} className="mt-2 w-full accent-[var(--mint)]" />
      </div>
    </details>
  );
}
