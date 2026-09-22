export function contributionHeight(count: number) {
  if (count <= 0) {
    return 0;
  }

  const height = 0.8 + Math.log2(count + 1) * 1.2;

  return Math.min(height, 10);
}
