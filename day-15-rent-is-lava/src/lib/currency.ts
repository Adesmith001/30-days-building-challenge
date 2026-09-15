export function formatNaira(value: number) {
  const rounded = Math.round(value)
  const absolute = Math.abs(rounded)
  const formatted = absolute.toLocaleString("en-NG")

  if (rounded < 0) {
    return `-₦${formatted}`
  }

  return `₦${formatted}`
}

export function formatNumber(value: number) {
  return Math.max(0, Math.round(value)).toLocaleString("en-NG")
}

export function parseMoney(value: string) {
  const numeric = value.replace(/[^\d]/g, "")

  if (!numeric) {
    return 0
  }

  return Number(numeric)
}

export function formatCompactNaira(value: number) {
  const absolute = Math.abs(value)
  const prefix = value < 0 ? "-" : ""

  if (absolute >= 1_000_000) {
    const amount = absolute / 1_000_000

    return `${prefix}₦${amount.toFixed(
      amount % 1 === 0 ? 0 : 1,
    )}M`
  }

  if (absolute >= 1_000) {
    return `${prefix}₦${Math.round(absolute / 1_000)}K`
  }

  return `${prefix}₦${Math.round(absolute)}`
}