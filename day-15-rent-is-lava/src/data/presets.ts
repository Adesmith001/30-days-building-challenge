import type { FinancialProfile } from "../types/simulation"

export const defaultProfile: FinancialProfile = {
  monthlyIncome: 450_000,
  annualRent: 1_800_000,
  rentDueInMonths: 7,
  rentSaved: 500_000,
  startingBuffer: 250_000,
  expenses: {
    food: 90_000,
    transport: 60_000,
    power: 35_000,
    data: 20_000,
    subscriptions: 12_000,
    debt: 0,
    other: 30_000,
  },
}