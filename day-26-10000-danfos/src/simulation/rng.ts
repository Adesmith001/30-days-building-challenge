export function hashSeed(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function nextU32(value: number) {
  let x = value >>> 0;

  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;

  return x >>> 0;
}

export function nextFloat(value: number) {
  const next = nextU32(value);
  return [next, next / 4294967296] as const;
}

export function mixSeed(base: number, index: number) {
  let value = base ^ Math.imul(index + 1, 0x9e3779b1);
  value = nextU32(value);
  value = nextU32(value ^ 0x85ebca6b);

  return value >>> 0;
}
