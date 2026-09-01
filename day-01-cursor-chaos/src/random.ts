export function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}
