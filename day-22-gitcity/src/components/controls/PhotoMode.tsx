"use client";

import { Camera } from "lucide-react";

import { sceneStore, useSceneStore } from "@/stores/scene-store";

export function PhotoMode() {
  const enabled = useSceneStore((value) => value.photoMode);

  function capture() {
    const canvas = document.querySelector("canvas");

    if (!canvas) {
      return;
    }

    const link = document.createElement("a");
    link.download = "gitcity.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="pointer-events-auto flex gap-1">
      <button type="button" onClick={() => sceneStore.setPhotoMode(!enabled)} className={`flex items-center gap-2 border px-3 py-2 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] ${enabled ? "border-[var(--mint)] text-[var(--mint)]" : "border-[var(--line)] bg-[#111419]/95 text-[var(--muted)]"}`}>
        <Camera size={12} /> PHOTO
      </button>
      {enabled && <button type="button" onClick={capture} className="border border-[var(--mint)] bg-[var(--mint)] px-3 py-2 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-[#071410]">EXPORT</button>}
    </div>
  );
}
