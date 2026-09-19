export function countPrimes(
  limit: number,
): number {
  if (limit < 2) {
    return 0;
  }

  let count = 1;

  outer:
  for (
    let value = 3;
    value <= limit;
    value += 2
  ) {
    const max =
      Math.sqrt(value);

    for (
      let divisor = 3;
      divisor <= max;
      divisor += 2
    ) {
      if (
        value % divisor === 0
      ) {
        continue outer;
      }
    }

    count += 1;
  }

  return count;
}