function hashString(input: string) {
  let hash = 2166136261

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

export function seededUnit(key: string) {
  let value = hashString(key) + 0x6d2b79f5

  value = Math.imul(value ^ (value >>> 15), value | 1)
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61)

  return ((value ^ (value >>> 14)) >>> 0) / 4294967296
}

export function seededRange(
  key: string,
  minimum: number,
  maximum: number,
) {
  return minimum + seededUnit(key) * (maximum - minimum)
}

export function seededInt(
  key: string,
  minimum: number,
  maximum: number,
) {
  const value = seededUnit(key)

  return Math.floor(
    minimum + value * (maximum - minimum + 1),
  )
}