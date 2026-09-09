export const money = (n: number) =>
  `₦${Math.round(n).toLocaleString('en-NG')}`

export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))
