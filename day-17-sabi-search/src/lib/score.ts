const ATTEMPT_SCORES = [
  1000,
  850,
  700,
  550,
  400,
];

export function calculateScore(
  attempts: number,
  hintUsed: boolean,
  won: boolean,
) {
  if (!won) {
    return 0;
  }

  const base =
    ATTEMPT_SCORES[
      attempts - 1
    ] ?? 300;

  return Math.max(
    250,
    base -
      (hintUsed ? 100 : 0),
  );
}

export function getResultLabel(
  won: boolean,
  attempts: number,
) {
  if (!won) {
    return "THIS ONE ESCAPE YOU.";
  }

  if (attempts === 1) {
    return "CLEAN HIT.";
  }

  if (attempts <= 3) {
    return "YOU SABI.";
  }

  return "YOU CATCH AM.";
}