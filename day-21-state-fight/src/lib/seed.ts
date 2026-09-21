export function hashSeed(
  input: string,
) {
  let hash = 2166136261;

  for (
    let i = 0;
    i < input.length;
    i += 1
  ) {
    hash ^= input.charCodeAt(i);

    hash = Math.imul(
      hash,
      16777619,
    );
  }

  return hash >>> 0;
}

export function mulberry32(
  seed: number,
) {
  return () => {
    let value =
      (seed += 0x6d2b79f5);

    value = Math.imul(
      value ^ (value >>> 15),
      value | 1,
    );

    value ^=
      value +
      Math.imul(
        value ^ (value >>> 7),
        value | 61,
      );

    return (
      (
        (
          value ^
          (value >>> 14)
        ) >>>
        0
      ) /
      4294967296
    );
  };
}

export function seededRandom(
  seed: string,
) {
  return mulberry32(
    hashSeed(seed),
  );
}

export function shuffleSeeded<T>(
  items: T[],
  random: () => number,
) {
  const result = [...items];

  for (
    let i = result.length - 1;
    i > 0;
    i -= 1
  ) {
    const j =
      Math.floor(
        random() * (i + 1),
      );

    [
      result[i],
      result[j],
    ] = [
      result[j],
      result[i],
    ];
  }

  return result;
}