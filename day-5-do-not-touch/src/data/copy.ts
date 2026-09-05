export function getButtonLabel(
  level: number,
  dodges: number,
  bossHits: number,
) {
  if (level === 10) {
    const labels = ["ABEG STOP", "SERIOUSLY?", "LAST ONE"];
    return labels[Math.min(bossHits, labels.length - 1)];
  }

  if (level === 3) {
    return dodges > 1 ? "NO BE TODAY" : "I DEY HERE";
  }

  if (level === 4 && dodges > 2) {
    return "I STILL DEY HERE";
  }

  if (level === 6) {
    return dodges > 1 ? "I SEE YOU OO" : "I DEY HERE";
  }

  if (level === 7 && dodges > 2) {
    return "YOU DEY RUN OO";
  }

  if (level >= 8 && dodges > 3) {
    return "CATCH ME IF YOU FIT";
  }

  return "I DEY HERE";
}

export const missCopy = [
  "E NEARLY HAPPEN.",
  "ABEG, FOCUS.",
  "TOO SLOW OO.",
  "YOU THINK SAY NA PLAY PLAY?",
  "NO BE TODAY.",
  "THIS ONE DEY PAINFUL.",
];