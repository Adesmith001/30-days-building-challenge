export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(value);
}

export function formatMetric(value: number, metricId: string) {
  if (metricId === "igr") return `₦${(value / 1_000_000_000).toFixed(1)}bn`;
  return formatNumber(value);
}

export function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
