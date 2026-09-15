import type { FinancialProfile } from "../types/simulation"

export const defaultProfile: FinancialProfile = {
  monthlyIncome: 0,
  annualRent: 0,
  rentDueInMonths: 0,
  rentSaved: 0,
  startingBuffer: 0,
  expenses: {
    food: 0,
    transport: 0,
    power: 0,
    data: 0,
    subscriptions: 0,
    debt: 0,
    other: 0,
  },
}
