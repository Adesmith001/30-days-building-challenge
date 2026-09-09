import type { Receipt } from '../types/receipt'

export const demoReceipt: Receipt = {
  merchant: 'SHOPRITE',
  date: '09 SEP 2026',
  currency: 'NGN',
  subtotal: 17350,
  tax: 1301,
  fees: 0,
  total: 19151,
  payment: 'CARD',
  items: [
    {
      id: 'bread',
      name: 'Bread Artisan Loaf',
      category: 'GROCERIES',
      quantity: 1,
      unitPrice: 1800,
      total: 1800,
      confidence: 98,
    },
    {
      id: 'milk',
      name: 'Fresh Whole Milk 2L',
      category: 'GROCERIES',
      quantity: 1,
      unitPrice: 2450,
      total: 2450,
      confidence: 99,
    },
    {
      id: 'eggs',
      name: 'Tray Fresh Eggs 30pk',
      category: 'GROCERIES',
      quantity: 1,
      unitPrice: 7900,
      total: 7900,
      confidence: 96,
    },
    {
      id: 'oil',
      name: 'Pure Vegetable Oil 3L',
      category: 'HOUSEHOLD',
      quantity: 1,
      unitPrice: 5200,
      total: 5200,
      confidence: 97,
    },
  ],
}

