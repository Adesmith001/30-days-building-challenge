import type {
  ScoreEvent,
  SimulationState,
} from "../types/simulation"

import { startingRentTarget } from "./finances"

interface ScoreResult {
  points: number
  events: ScoreEvent[]
  cleanMonths: number
  gapOpen: boolean
  earlyBonusAwarded: boolean
  rentStatus: SimulationState["rentStatus"]
  rentShortfall: number
  willEnd: boolean
}

export function getScoreLabel(score: number) {
  if (score >= 11_000) return "BUILT TO SURVIVE"
  if (score >= 8_500) return "AHEAD OF THE HEAT"
  if (score >= 6_000) return "HOLDING STEADY"
  if (score >= 3_500) return "FINDING A RHYTHM"
  if (score >= 1_500) return "STILL STANDING"

  return "GETTING STARTED"
}

export function scoreMonth(
  state: SimulationState,
): ScoreResult {
  const events: ScoreEvent[] = []
  const month = state.current.index + 1

  let points = 0
  let cleanMonths = state.cleanMonths
  let gapOpen = state.gapOpen
  let earlyBonusAwarded = state.earlyBonusAwarded
  let rentStatus = state.rentStatus
  let rentShortfall = state.rentShortfall
  let willEnd = false

  const add = (
    type: string,
    label: string,
    value: number,
  ) => {
    points += value

    events.push({
      type,
      label,
      points: value,
      month,
    })
  }

  const targetHit =
    rentStatus === "covered" ||
    state.current.rentTarget === 0 ||
    state.current.rentContribution + 1 >=
      state.current.rentTarget

  const rentUntouched = state.current.usedRent === 0

  add("survive", "MONTH SURVIVED", 200)

  if (targetHit) {
    add("rent-target", "RENT TARGET HIT", 250)
  }

  if (rentUntouched) {
    add("rent-untouched", "RENT POT UNTOUCHED", 150)
  }

  if (state.cash > 0) {
    add("free-cash", "FREE CASH REMAINED", 100)
  }

  if (
    state.current.eventCost > 0 &&
    rentUntouched
  ) {
    add("absorbed", "EVENT ABSORBED", 150)
  }

  if (state.buffer > 0) {
    add("buffer", "BUFFER MAINTAINED", 100)
  }

  const clean = targetHit && rentUntouched

  if (clean) {
    cleanMonths += 1

    const milestones: Record<number, number> = {
      2: 100,
      3: 200,
      6: 500,
    }

    const bonus = milestones[cleanMonths]

    if (bonus) {
      add(
        "clean-milestone",
        `${cleanMonths} CLEAN MONTHS`,
        bonus,
      )
    }
  }

  const initialTarget = startingRentTarget(state.profile)

  const idealRentPot = Math.min(
    state.profile.annualRent,
    state.profile.rentSaved +
      initialTarget * month,
  )

  if (
    gapOpen &&
    state.rentPot >= idealRentPot
  ) {
    gapOpen = false
    add("gap-closed", "RENT GAP CLOSED", 300)
  }

  if (
    rentStatus === "pending" &&
    !earlyBonusAwarded &&
    month < state.profile.rentDueInMonths &&
    state.rentPot >= state.profile.annualRent
  ) {
    earlyBonusAwarded = true
    add("rent-ready", "RENT READY EARLY", 750)
  }

  if (
    rentStatus === "pending" &&
    month === state.profile.rentDueInMonths
  ) {
    if (state.rentPot >= state.profile.annualRent) {
      rentStatus = "covered"
      rentShortfall = 0
      add("rent-covered", "RENT COVERED", 1_000)
    } else {
      rentStatus = "short"
      rentShortfall =
        state.profile.annualRent - state.rentPot

      willEnd = true
    }
  }

  if (month === 12) {
    add("year-complete", "12 MONTHS COMPLETE", 1_200)
    willEnd = true
  }

  return {
    points,
    events,
    cleanMonths,
    gapOpen,
    earlyBonusAwarded,
    rentStatus,
    rentShortfall,
    willEnd,
  }
}