export function hashString(value: string) {
  let hash = 2166136261

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

export function seededRandom(seed: string) {
  let state = hashString(seed)

  return () => {
    state += 0x6d2b79f5

    let value = state

    value = Math.imul(value ^ (value >>> 15), value | 1)

    value ^= value + Math.imul(
      value ^ (value >>> 7),
      value | 61,
    )

    return (
      ((value ^ (value >>> 14)) >>> 0) /
      4294967296
    )
  }
}

export function seededRange(
  seed: string,
  min: number,
  max: number,
) {
  const random = seededRandom(seed)

  return min + random() * (max - min)
}

export function projectSeed(name: string) {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")

  return `${cleaned || "brand"}:v1`
}

export function remixSeed(
  rootSeed: string,
  variantNumber: number,
) {
  const root = rootSeed.split(":v")[0]

  return `${root}:v${variantNumber}`
}