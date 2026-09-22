"use client";

import { Camera, Landmark, Map, Route } from "lucide-react";

import { sceneStore, useSceneStore } from "@/stores/scene-store";

const modes = [
  ["overview", Map, "OVERVIEW"],
  ["street", Route, "STREET"],
  ["hall", Landmark, "CITY HALL"],
  ["repositories", Camera, "LANDMARKS"],
] as const;

export function CameraDock() {
  const activeMode = useSceneStore((value) => value.cameraMode);

  return (
    <div className="pointer-events-auto flex border border-[var(--line)] bg-[#111419]/95 p-1 backdrop-blur-xl">
      {modes.map(([mode, Icon, label]) => (
        <button key={mode} type="button" onClick={() => sceneStore.setCameraMode(mode)} className={`flex items-center gap-2 px-3 py-2 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] transition ${activeMode === mode ? "bg-[var(--surface-high)] text-[var(--mint)]" : "text-[var(--muted)] hover:text-white"}`}>
          <Icon size={12} strokeWidth={1.5} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
