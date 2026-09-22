export function interpolateTemporalHeight(currentHeight: number, previousHeight: number, yearShift: number) {
  const progress = Math.min(1, Math.max(0, yearShift));

  return previousHeight + (currentHeight - previousHeight) * progress;
}
