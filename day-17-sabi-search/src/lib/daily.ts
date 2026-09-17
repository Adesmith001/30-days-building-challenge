import { SABI_WORDS } from "../data/words";

export function getUtcDateKey(
  date = new Date(),
) {
  const year =
    date.getUTCFullYear();

  const month =
    String(
      date.getUTCMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getUTCDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function hash(value: string) {
  let result = 2166136261;

  for (
    let i = 0;
    i < value.length;
    i += 1
  ) {
    result ^=
      value.charCodeAt(i);

    result =
      Math.imul(
        result,
        16777619,
      );
  }

  return result >>> 0;
}

export function getDailyWord(
  dateKey = getUtcDateKey(),
) {
  const index =
    hash(dateKey) %
    SABI_WORDS.length;

  return SABI_WORDS[index];
}

export function getRandomWord(
  exclude?: string,
) {
  const pool =
    SABI_WORDS.filter(
      (item) =>
        item.answer !== exclude,
    );

  return pool[
    Math.floor(
      Math.random() *
        pool.length,
    )
  ];
}