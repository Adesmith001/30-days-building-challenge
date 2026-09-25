import type { IncidentScenario } from "@/types";

export function clockToSeconds(clock: string) {
  const [h, m, s] = clock.split(":").map(Number);

  return h * 3600 + m * 60 + s;
}

export function secondsToClock(total: number) {
  const day = 24 * 3600;
  const safe = ((total % day) + day) % day;

  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor(
    (safe % 3600) / 60,
  );
  const seconds = Math.floor(safe % 60);

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function scenarioTime(
  scenario: IncidentScenario,
  offset: number,
) {
  return secondsToClock(
    clockToSeconds(scenario.startClock) + offset,
  );
}

export function duration(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = Math.max(0, value % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;
}
