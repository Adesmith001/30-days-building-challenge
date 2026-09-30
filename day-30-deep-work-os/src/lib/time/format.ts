export function formatClock(ms: number) {
  const safe = Math.max(0, ms);

  const totalSeconds = Math.floor(safe / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");
  }

  return [
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

export function formatHumanDuration(ms: number) {
  const minutes = Math.round(ms / 60_000);

  if (minutes < 60) {
    return `${minutes} MIN`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder
    ? `${hours}H ${remainder}M`
    : `${hours}H`;
}