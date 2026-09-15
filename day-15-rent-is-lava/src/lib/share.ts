import type { SimulationState } from "../types/simulation"

import { formatCompactNaira } from "./currency"
import { getScoreLabel } from "./scoring"

export async function shareRun(
  state: SimulationState,
) {
  const rentLine =
    state.rentStatus === "covered"
      ? "RENT COVERED"
      : `${formatCompactNaira(
          state.rentShortfall,
        )} RENT GAP`

  const text = [
    "RENT IS LAVA",
    "DAY 15 / 30",
    "",
    state.score.toLocaleString(),
    getScoreLabel(state.score),
    "",
    rentLine,
    `${state.cleanMonths} CLEAN MONTHS`,
    `${formatCompactNaira(
      state.buffer,
    )} ENDING BUFFER`,
    "",
    "WOULD YOUR SALARY SURVIVE?",
  ].join("\n")

  if (navigator.share) {
    await navigator.share({
      title: "Rent Is Lava",
      text,
    })

    return
  }

  await navigator.clipboard.writeText(text)
}