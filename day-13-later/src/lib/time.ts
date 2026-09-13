import {
  addDays,
  addHours,
  addMinutes,
  format,
  isSameDay,
  nextSaturday,
  set,
} from "date-fns";

export type QuickTimeOption =
  | "10-minutes"
  | "1-hour"
  | "tonight"
  | "tomorrow"
  | "weekend";

export type DayPeriod =
  | "morning"
  | "afternoon"
  | "evening";

export function getQuickDate(
  option: QuickTimeOption,
): Date {
  const now = new Date();

  switch (option) {
    case "10-minutes":
      return addMinutes(now, 10);

    case "1-hour":
      return addHours(now, 1);

    case "tonight": {
      let tonight = set(now, {
        hours: 19,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });

      if (tonight <= now) {
        tonight = addHours(now, 1);
      }

      return tonight;
    }

    case "tomorrow":
      return addDays(now, 1);

    case "weekend":
      return nextSaturday(now);

    default:
      return now;
  }
}

export function applyDayPeriod(
  date: Date,
  period: DayPeriod,
): Date {
  const hours = {
    morning: 9,
    afternoon: 14,
    evening: 19,
  };

  return set(date, {
    hours: hours[period],
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
}

export function applyExactHour(
  date: Date,
  hour: number,
): Date {
  return set(date, {
    hours: hour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
}

export function formatCommitmentDate(
  timestamp: number,
) {
  const date = new Date(timestamp);
  const now = new Date();

  if (isSameDay(date, now)) {
    return `Today · ${format(date, "h:mm a")}`;
  }

  if (isSameDay(date, addDays(now, 1))) {
    return `Tomorrow · ${format(date, "h:mm a")}`;
  }

  return format(date, "EEE, MMM d · h:mm a");
}

export function formatFullDate(
  timestamp: number,
) {
  return format(
    new Date(timestamp),
    "EEEE · MMMM d · h:mm a",
  );
}

export function getTimeRemaining(
  timestamp: number,
  showSeconds = false,
) {
  const difference = timestamp - Date.now();

  if (difference <= 0) {
    return "Later is now.";
  }

  const totalSeconds = Math.floor(
    difference / 1_000,
  );

  if (showSeconds) {
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  }

  const totalMinutes = Math.floor(totalSeconds / 60);

  const days = Math.floor(
    totalMinutes / 1440,
  );

  const hours = Math.floor(
    (totalMinutes % 1440) / 60,
  );

  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export function toDateTimeLocalValue(
  date: Date,
) {
  const offset =
    date.getTimezoneOffset() * 60_000;

  return new Date(
    date.getTime() - offset,
  )
    .toISOString()
    .slice(0, 16);
}
