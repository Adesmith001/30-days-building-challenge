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
    let t =
      (seed += 0x6d2b79f5);

    t = Math.imul(
      t ^ (t >>> 15),
      t | 1,
    );

    t ^=
      t +
      Math.imul(
        t ^ (t >>> 7),
        t | 61,
      );

    return (
      (t ^ (t >>> 14)) >>> 0
    ) / 4294967296;
  };
}

export function seededShuffle<T>(
  items: readonly T[],
  seed: string,
): T[] {
  const random = mulberry32(
    hashSeed(seed),
  );

  const result = [...items];

  for (
    let i = result.length - 1;
    i > 0;
    i -= 1
  ) {
    const j = Math.floor(
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

export function pickSeeded<T>(
  items: readonly T[],
  seed: string,
): T {
  const random = mulberry32(
    hashSeed(seed),
  );

  return items[
    Math.floor(
      random() * items.length,
    )
  ];
}