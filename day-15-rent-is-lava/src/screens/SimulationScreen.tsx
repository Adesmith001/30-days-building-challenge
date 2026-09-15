/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"

import type {
  FundingSource,
  SimulationState,
} from "../types/simulation"

import { EventStage } from "../components/EventStage"
import { FundingStage } from "../components/FundingStage"
import { MonthSummary } from "../components/MonthSummary"
import { PaydayStage } from "../components/PaydayStage"
import { RentWarningStage } from "../components/RentWarningStage"

interface Props {
  state: SimulationState
  onConfirmPayday: () => void
  onResolveEvent: (choiceId?: string) => void
  onFundEvent: (source: FundingSource) => void
  onNextMonth: () => void
}

export function SimulationScreen({
  state,
  onConfirmPayday,
  onResolveEvent,
  onFundEvent,
  onNextMonth,
}: Props) {
  const [warningsSeen, setWarningsSeen] =
    useState<number[]>([])

  useEffect(() => {
    setWarningsSeen([])
  }, [state.seed])

  const currentNumber = state.current.index + 1

  const monthsAway =
    state.profile.rentDueInMonths -
    currentNumber

  const warningDue =
    state.phase === "payday" &&
    state.rentStatus === "pending" &&
    (monthsAway === 3 || monthsAway === 1) &&
    !warningsSeen.includes(currentNumber)

  if (warningDue) {
    return (
      <RentWarningStage
        state={state}
        monthsAway={monthsAway}
        onContinue={() =>
          setWarningsSeen((current) => [
            ...current,
            currentNumber,
          ])
        }
      />
    )
  }

  if (state.phase === "payday") {
    return (
      <PaydayStage
        state={state}
        onConfirm={onConfirmPayday}
      />
    )
  }

  if (state.phase === "event") {
    return (
      <EventStage
        key={`${state.current.index}:${state.current.event?.id}`}
        state={state}
        onResolve={onResolveEvent}
      />
    )
  }

  if (state.phase === "funding") {
    return (
      <FundingStage
        state={state}
        onFund={onFundEvent}
      />
    )
  }

  return (
    <MonthSummary
      state={state}
      onNext={onNextMonth}
    />
  )
}