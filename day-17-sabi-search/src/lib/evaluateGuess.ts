import type {
  EvaluatedLetter,
  LetterStatus,
} from "../types/game";

export function evaluateGuess(
  guess: string,
  answer: string,
): EvaluatedLetter[] {
  const letters = guess
    .toUpperCase()
    .split("");

  const target = answer
    .toUpperCase()
    .split("");

  const result: EvaluatedLetter[] =
    letters.map((letter) => ({
      letter,
      status: "absent",
    }));

  const remaining =
    new Map<string, number>();

  target.forEach((letter, index) => {
    if (letters[index] === letter) {
      result[index].status = "correct";
      return;
    }

    remaining.set(
      letter,
      (remaining.get(letter) ?? 0) + 1,
    );
  });

  letters.forEach((letter, index) => {
    if (
      result[index].status === "correct"
    ) {
      return;
    }

    const count =
      remaining.get(letter) ?? 0;

    if (count > 0) {
      result[index].status = "present";

      remaining.set(
        letter,
        count - 1,
      );
    }
  });

  return result;
}

const rank: Record<
  LetterStatus,
  number
> = {
  empty: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

export function getKeyboardStatuses(
  rows: EvaluatedLetter[][],
) {
  const map =
    new Map<string, LetterStatus>();

  rows
    .flat()
    .forEach(
      ({ letter, status }) => {
        const previous =
          map.get(letter) ?? "empty";

        if (
          rank[status] >
          rank[previous]
        ) {
          map.set(
            letter,
            status,
          );
        }
      },
    );

  return map;
}