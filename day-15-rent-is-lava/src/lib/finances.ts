import type {
  ExpenseKey,
  FinancialProfile,
  MonthlyExpenses,
} from "../types/simulation"

import { seededRange } from "./random"

export const monthNames = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
]

function roundHundred(value: number) {
  return Math.max(0, Math.round(value / 100) * 100)
}

function vary(
  seed: string,
  month: number,
  key: ExpenseKey,
  value: number,
  percentage: number,
) {
  const multiplier = seededRange(
    `${seed}:${month}:${key}`,
    1 - percentage,
    1 + percentage,
  )

  return roundHundred(value * multiplier)
}

function modifier(
  recurring: Partial<MonthlyExpenses>,
  key: ExpenseKey,
) {
  return recurring[key] ?? 0
}

export function buildMonthlyExpenses(
  profile: FinancialProfile,
  seed: string,
  month: number,
  recurring: Partial<MonthlyExpenses>,
  oneOffCharge = 0,
): MonthlyExpenses {
  return {
    food:
      vary(seed, month, "food", profile.expenses.food, 0.08) +
      modifier(recurring, "food"),

    transport:
      vary(
        seed,
        month,
        "transport",
        profile.expenses.transport,
        0.15,
      ) + modifier(recurring, "transport"),

    power:
      vary(seed, month, "power", profile.expenses.power, 0.2) +
      modifier(recurring, "power"),

    data:
      profile.expenses.data +
      modifier(recurring, "data"),

    subscriptions:
      profile.expenses.subscriptions +
      modifier(recurring, "subscriptions"),

    debt:
      profile.expenses.debt +
      modifier(recurring, "debt"),

    other:
      vary(seed, month, "other", profile.expenses.other, 0.15) +
      modifier(recurring, "other") +
      oneOffCharge,
  }
}

export function expensesTotal(expenses: MonthlyExpenses) {
  return Object.values(expenses).reduce(
    (total, value) => total + value,
    0,
  )
}

export function essentialsTotal(expenses: MonthlyExpenses) {
  return (
    expenses.food +
    expenses.transport +
    expenses.power +
    expenses.data +
    expenses.debt
  )
}

export function flexTotal(expenses: MonthlyExpenses) {
  return expenses.subscriptions + expenses.other
}

export function calculateRentTarget(
  annualRent: number,
  rentPot: number,
  rentDueInMonths: number,
  monthIndex: number,
) {
  const remaining = Math.max(0, annualRent - rentPot)

  const monthsRemaining = Math.max(
    1,
    rentDueInMonths - monthIndex,
  )

  return Math.ceil(remaining / monthsRemaining)
}

export function startingRentTarget(profile: FinancialProfile) {
  const remaining = Math.max(
    0,
    profile.annualRent - profile.rentSaved,
  )

  return Math.ceil(
    remaining / Math.max(1, profile.rentDueInMonths),
  )
}