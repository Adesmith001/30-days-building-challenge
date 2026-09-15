import type { LifeEvent } from "../types/simulation"

export const lifeEvents: LifeEvent[] = [
  {
    id: "nepa-surprise",
    title: "NEPA SAID SURPRISE.",
    description:
      "Power and generator costs ran higher than expected this month.",
    classification: "INFRASTRUCTURE DEFICIT",
    kind: "cost",
    amount: 25_000,
  },
  {
    id: "fuel-moved",
    title: "FUEL MOVED AGAIN.",
    description:
      "Your regular transport pattern suddenly costs more.",
    classification: "TRANSPORT SHOCK",
    kind: "cost",
    amount: 18_000,
  },
  {
    id: "generator-repair",
    title: "THE GENERATOR HAS OPINIONS.",
    description:
      "A repair cannot wait until next month.",
    classification: "EQUIPMENT FAILURE",
    kind: "cost",
    amount: 65_000,
  },
  {
    id: "family-function",
    title: "FAMILY FUNCTION.",
    description:
      "An unexpected contribution has your name on it.",
    classification: "SOCIAL OBLIGATION",
    kind: "cost",
    amount: 35_000,
  },
  {
    id: "medical-expense",
    title: "HEALTH DID NOT CHECK THE BUDGET.",
    description:
      "A routine medical expense lands outside the plan.",
    classification: "HEALTH EXPENSE",
    kind: "cost",
    amount: 28_000,
  },
  {
    id: "subscription-renewal",
    title: "AUTO-RENEWAL WON.",
    description:
      "A forgotten annual subscription clears before cancellation.",
    classification: "RECURRING LIABILITY",
    kind: "cost",
    amount: 18_000,
  },
  {
    id: "appliance",
    title: "THE FRIDGE CHOSE TODAY.",
    description:
      "A necessary home appliance needs immediate attention.",
    classification: "HOUSEHOLD SHOCK",
    kind: "cost",
    amount: 45_000,
  },
  {
    id: "school-contribution",
    title: "ONE MORE CONTRIBUTION.",
    description:
      "A time-sensitive personal obligation enters the month.",
    classification: "SOCIAL EXPENSE",
    kind: "cost",
    amount: 30_000,
  },
  {
    id: "refund",
    title: "SMALL WIN.",
    description:
      "A refund you had mentally written off finally lands.",
    classification: "CREDIT REVERSAL",
    kind: "income",
    amount: 24_000,
  },
  {
    id: "freelance",
    title: "FREELANCE ALERT.",
    description:
      "A small side project pays out this month.",
    classification: "SUPPLEMENTAL INCOME",
    kind: "income",
    amount: 80_000,
  },
  {
    id: "bonus",
    title: "PAYROLL HAD GOOD NEWS.",
    description:
      "A one-off bonus arrives with this month's cash flow.",
    classification: "PAYROLL CREDIT",
    kind: "income",
    amount: 100_000,
  },
  {
    id: "transport-kind",
    title: "TRANSPORT WAS KIND.",
    description:
      "Your movement costs came in materially below expectation.",
    classification: "COST REVERSAL",
    kind: "income",
    amount: 12_000,
  },
  {
    id: "bank-reversal",
    title: "REVERSAL RECEIVED.",
    description:
      "A previously disputed charge returns to your account.",
    classification: "BANK CREDIT",
    kind: "income",
    amount: 16_000,
  },
  {
    id: "data-increase",
    title: "DATA PLAN INCREASE.",
    description:
      "Your normal data plan is now more expensive each month.",
    classification: "RECURRING PRESSURE",
    kind: "recurring",
    recurring: {
      data: 4_000,
    },
  },
  {
    id: "route-change",
    title: "THE COMMUTE CHANGED.",
    description:
      "A route change adds a recurring transport cost.",
    classification: "RECURRING PRESSURE",
    kind: "recurring",
    recurring: {
      transport: 6_000,
    },
  },
  {
    id: "utility-levy",
    title: "UTILITY LEVY.",
    description:
      "Your recurring power cost increases from this month onward.",
    classification: "RECURRING PRESSURE",
    kind: "recurring",
    recurring: {
      power: 5_000,
    },
  },
  {
    id: "phone-screen",
    title: "YOUR PHONE SCREEN IS DONE.",
    description:
      "It needs attention.",
    classification: "DECISION REQUIRED",
    kind: "decision",
    choices: [
      {
        id: "replace",
        label: "REPLACE",
        description: "Reliable immediately.",
        effect: "cost",
        amount: 75_000,
      },
      {
        id: "repair",
        label: "REPAIR",
        description:
          "Cheaper now, but there is a chance another issue appears.",
        effect: "cost",
        amount: 32_000,
        followUp: {
          chance: 0.45,
          amount: 18_000,
        },
      },
    ],
  },
  {
    id: "laptop-battery",
    title: "THE LAPTOP BATTERY IS FINISHED.",
    description:
      "Work still needs to happen.",
    classification: "DECISION REQUIRED",
    kind: "decision",
    choices: [
      {
        id: "replace-battery",
        label: "REPLACE BATTERY",
        description: "Solve the problem now.",
        effect: "cost",
        amount: 48_000,
      },
      {
        id: "manage",
        label: "MANAGE FOR NOW",
        description:
          "Spend less now, but power usage rises each month.",
        effect: "cost",
        amount: 8_000,
        recurring: {
          power: 3_500,
        },
      },
    ],
  },
]