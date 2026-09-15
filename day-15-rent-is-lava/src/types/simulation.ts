export type ExpenseKey =
  | "food"
  | "transport"
  | "power"
  | "data"
  | "subscriptions"
  | "debt"
  | "other"

export interface MonthlyExpenses {
  food: number
  transport: number
  power: number
  data: number
  subscriptions: number
  debt: number
  other: number
}

export interface FinancialProfile {
  monthlyIncome: number
  annualRent: number
  rentDueInMonths: number
  rentSaved: number
  startingBuffer: number
  expenses: MonthlyExpenses
}

export interface FollowUpEffect {
  chance: number
  amount: number
}

export interface EventChoice {
  id: string
  label: string
  description: string
  effect: "cost" | "income"
  amount: number
  recurring?: Partial<MonthlyExpenses>
  followUp?: FollowUpEffect
}

export type LifeEventKind =
  | "cost"
  | "income"
  | "recurring"
  | "decision"

export interface LifeEvent {
  id: string
  title: string
  description: string
  classification: string
  kind: LifeEventKind
  amount?: number
  recurring?: Partial<MonthlyExpenses>
  choices?: EventChoice[]
}

export type SimulationPhase =
  | "payday"
  | "event"
  | "funding"
  | "summary"
  | "complete"

export type RentStatus =
  | "pending"
  | "covered"
  | "short"

export type FundingSource =
  | "buffer"
  | "rent"
  | "deficit"

export interface ActiveMonth {
  index: number
  name: string
  income: number
  expenses: MonthlyExpenses
  normalExpenses: number
  rentTarget: number
  rentContribution: number
  event: LifeEvent | null
  eventCost: number
  eventIncome: number
  usedBuffer: number
  usedRent: number
  eventDeficit: number
  oneOffCharge: number
  scoreGain: number
  scoreLabels: string[]
}

export interface MonthState {
  month: number
  name: string
  income: number
  expenses: MonthlyExpenses
  normalExpenses: number
  rentTarget: number
  rentContribution: number
  eventTitle: string | null
  eventCost: number
  eventIncome: number
  usedBuffer: number
  usedRent: number
  cash: number
  buffer: number
  rentPot: number
  score: number
  scoreGain: number
  clean: boolean
  scoreLabels: string[]
}

export interface PendingPayment {
  title: string
  eventId: string
  total: number
  remaining: number
}

export interface ScoreEvent {
  type: string
  label: string
  points: number
  month: number
}

export interface SimulationState {
  profile: FinancialProfile
  seed: string
  monthIndex: number
  phase: SimulationPhase
  cash: number
  buffer: number
  rentPot: number
  score: number
  cleanMonths: number
  rentWithdrawalCount: number
  rentWithdrawnTotal: number
  unexpectedCosts: number
  totalIncome: number
  totalNormalSpend: number
  rentStatus: RentStatus
  rentShortfall: number
  current: ActiveMonth
  months: MonthState[]
  recurring: Partial<MonthlyExpenses>
  appliedRecurringEventIds: string[]
  oneOffCharges: Record<number, number>
  pendingPayment: PendingPayment | null
  scoreEvents: ScoreEvent[]
  gapOpen: boolean
  earlyBonusAwarded: boolean
  willEndAfterSummary: boolean
  decisionChoices: Record<string, string>
  fundingChoices: Record<string, FundingSource[]>
}

export type CompareVariable =
  | "annualRent"
  | "monthlyIncome"
  | "food"
  | "transport"
  | "startingBuffer"

export interface ScenarioComparison {
  variable: CompareVariable
  originalValue: number
  scenarioValue: number
  resultScore: number
  rentStatus: RentStatus
  rentShortfall: number
  endingBuffer: number
  endingCash: number
}

export interface SavedRun {
  id: string
  timestamp: string
  state: SimulationState
  comparisons: ScenarioComparison[]
}