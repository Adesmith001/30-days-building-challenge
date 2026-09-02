import type {
  Attendee,
  EfficiencyAnswers,
  WorkSettings,
} from "../types/meeting";

function annualSalary(attendee: Attendee) {
  return attendee.salaryPeriod === "monthly"
    ? attendee.salary * 12
    : attendee.salary;
}

export function hourlyRate(
  attendee: Attendee,
  settings: WorkSettings,
) {
  const workingHours =
    settings.weeksPerYear *
    settings.daysPerWeek *
    settings.hoursPerDay;

  if (!workingHours) return 0;

  return annualSalary(attendee) / workingHours;
}

export function attendeeCost(
  attendee: Attendee,
  elapsedMs: number,
  settings: WorkSettings,
) {
  const start = Math.max(0, attendee.joinedAtMs);

  const end = Math.min(
    elapsedMs,
    attendee.leftAtMs ?? elapsedMs,
  );

  const activeMs = Math.max(0, end - start);

  return (
    hourlyRate(attendee, settings) *
    attendee.quantity *
    (activeMs / 3_600_000)
  );
}

export function meetingCost(
  attendees: Attendee[],
  elapsedMs: number,
  settings: WorkSettings,
) {
  return attendees.reduce(
    (sum, attendee) =>
      sum + attendeeCost(attendee, elapsedMs, settings),
    0,
  );
}

export function burnRatePerHour(
  attendees: Attendee[],
  settings: WorkSettings,
  activeOnly = false,
) {
  return attendees
    .filter((attendee) =>
      activeOnly ? attendee.active : true,
    )
    .reduce(
      (sum, attendee) =>
        sum +
        hourlyRate(attendee, settings) *
          attendee.quantity,
      0,
    );
}

export function peopleCount(
  attendees: Attendee[],
  activeOnly = false,
) {
  return attendees
    .filter((attendee) =>
      activeOnly ? attendee.active : true,
    )
    .reduce(
      (sum, attendee) => sum + attendee.quantity,
      0,
    );
}

export function efficiencyScore(
  answers?: EfficiencyAnswers,
) {
  if (!answers) return 0;

  let score = 0;

  if (answers.decisionMade) score += 40;
  if (answers.clearAgenda) score += 30;
  if (answers.everyoneNeeded) score += 30;

  return score;
}

export function efficiencyVerdict(score: number) {
  if (score >= 90) return "Worth the calendar invite.";
  if (score >= 70) return "Acceptable.";
  if (score >= 40) {
    return "Probably could have been an email.";
  }

  return "This absolutely could have been an email.";
}