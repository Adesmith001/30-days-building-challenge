export function interpolateTemporalHeight(currentHeight: number, previousHeight: number, yearShift: number) {
  const progress = Math.min(1, Math.max(0, yearShift));

  return previousHeight + (currentHeight - previousHeight) * progress;
}

export function getReplayFactor(index: number, cursor: number, replayActive: boolean) {
  if (!replayActive) {
    return 1;
  }

  if (index <= cursor) {
    return 1;
  }

  return 0;
}
