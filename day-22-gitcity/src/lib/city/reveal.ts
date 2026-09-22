import type { RevealPhase, RevealState } from "@/types/scene";

export function clampProgress(progress: number) {
  return Math.min(1, Math.max(0, progress));
}

export function getRevealState(progress: number): RevealState {
  const normalized = clampProgress(progress);
  let phase: RevealPhase = "ground";

  if (normalized >= 0.85) {
    phase = "complete";
  } else if (normalized >= 0.65) {
    phase = "tilt";
  } else if (normalized > 0) {
    phase = "rise";
  }

  return {
    progress: normalized,
    phase,
  };
}

export function revealHeight(height: number, progress: number) {
  const normalized = clampProgress(progress);
  const riseProgress = Math.min(1, normalized / 0.72);

  return height * riseProgress;
}
