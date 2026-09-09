export const money = (n: number, currency = 'NGN') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'NGN',
    }).format(n)
  } catch {
    return `${currency || 'NGN'} ${n.toLocaleString('en-US')}`
  }
}

export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))
