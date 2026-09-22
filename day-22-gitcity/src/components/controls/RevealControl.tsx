"use client";

import { Play } from "lucide-react";

import { sceneStore, useSceneStore } from "@/stores/scene-store";

export function RevealControl() {
  const isRevealing = useSceneStore((value) => value.isRevealing);

  function startReveal() {
    sceneStore.setRevealing(true);
    sceneStore.setRevealProgress(0);
    sceneStore.navigateTo("overview");
  }

  return (
    <button type="button" onClick={startReveal} disabled={isRevealing} className="pointer-events-auto flex items-center gap-2 border border-[var(--line)] bg-[#111419]/95 px-3 py-2 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-[var(--mint)] disabled:opacity-50">
      <Play size={12} /> REPLAY BUILD
    </button>
  );
}
