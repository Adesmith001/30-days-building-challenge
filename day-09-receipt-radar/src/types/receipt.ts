export type Item = {
  id: string
  name: string
  category: string
  quantity: number
  unitPrice: number
  total: number
  confidence: number
}

export type Receipt = {
  merchant: string
  date: string
  currency: string
  subtotal: number
  tax: number
  fees: number
  total: number
  payment: string
  items: Item[]
  image?: string
}

export type Flag = {
  type: 'error' | 'warn' | 'info'
  title: string
  detail: string
  field?: string
}

export type Stage = 'idle' | 'scanning' | 'review' | 'history'

