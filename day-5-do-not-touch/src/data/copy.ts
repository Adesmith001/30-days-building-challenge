export function getButtonLabel(
  level: number,
  dodges: number,
  bossHits: number,
) {
  if (level === 10) {
    const labels = ["STOP", "SERIOUSLY?", "LAST ONE"];
    return labels[Math.min(bossHits, labels.length - 1)];
  }

  if (level === 3) {
    return dodges > 1 ? "NOPE" : "TOUCH ME";
  }

  if (level === 4 && dodges > 2) {
    return "STILL HERE";
  }

  if (level === 6) {
    return dodges > 1 ? "I SAW THAT COMING" : "TOUCH ME";
  }

  if (level === 7 && dodges > 2) {
    return "SLOW DOWN";
  }

  if (level >= 8 && dodges > 3) {
    return "CATCH ME";
  }

  return "TOUCH ME";
}

export const missCopy = [
  "ALMOST.",
  "CUTE.",
  "TOO SLOW.",
  "YOU THOUGHT.",
  "NOT EVEN CLOSE.",
  "THIS IS GETTING AWKWARD.",
];