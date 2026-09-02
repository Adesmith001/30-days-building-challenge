import type { Currency } from "../types/meeting";

const symbols: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export function formatMoney(
  value: number,
  currency: Currency = "NGN",
) {
  const amount = new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

  return `${symbols[currency]}${amount}`;
}

export function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function formatShortDuration(ms: number) {
  const minutes = Math.floor(ms / 60_000);

  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m`;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatClock(iso: string) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}