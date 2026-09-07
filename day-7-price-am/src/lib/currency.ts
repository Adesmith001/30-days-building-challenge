const numberFormatter = new Intl.NumberFormat("en-NG", {
  maximumFractionDigits: 0,
});

export function formatNaira(value: number) {
  return `₦${numberFormatter.format(Math.round(value))}`;
}

export function formatNumber(value: number) {
  return numberFormatter.format(Math.round(value));
}

export function parseNaira(value: string) {
  const clean = value.replace(/[^\d]/g, "");

  return clean ? Number(clean) : 0;
}

export function clampPrice(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(Math.max(value, min), max);
}