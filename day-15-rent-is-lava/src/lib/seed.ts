export function makeRunSeed() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)

  const random = new Uint32Array(1)
  crypto.getRandomValues(random)

  const suffix = String(random[0] % 10_000).padStart(4, "0")

  return `${date}-${suffix}`
}