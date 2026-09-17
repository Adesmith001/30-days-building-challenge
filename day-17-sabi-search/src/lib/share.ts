import type {
  EvaluatedLetter,
  GameMode,
} from "../types/game";

const square = (
  status:
    EvaluatedLetter["status"],
) => {
  if (status === "correct") {
    return "🟩";
  }

  if (status === "present") {
    return "🟨";
  }

  return "⬛";
};

export function buildShareText(
  mode: GameMode,
  rows: EvaluatedLetter[][],
  won: boolean,
  attempts: number,
) {
  const title =
    mode === "daily"
      ? "DAILY SABI"
      : "SABI RUN";

  const result =
    won
      ? `${attempts}/5`
      : "X/5";

  const grid =
    rows
      .map((row) =>
        row
          .map((cell) =>
            square(
              cell.status,
            ),
          )
          .join(""),
      )
      .join("\n");

  return [
    "SABI SEARCH · 17/30",
    `${title} · ${result}`,
    "",
    grid,
    "",
    "How much you sabi?",
  ].join("\n");
}

export async function shareResult(
  text: string,
) {
  if (navigator.share) {
    await navigator.share({
      text,
    });

    return "SHARED";
  }

  await navigator.clipboard.writeText(
    text,
  );

  return "COPIED";
}