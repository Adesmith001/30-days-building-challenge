const compactFormatter = new Intl.NumberFormat("en-NG", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatInputMoney(value: number) {
  if (!value) return "";

  return new Intl.NumberFormat("en-NG").format(value);
}

export function formatNaira(value: number) {
  const sign = value < 0 ? "-" : "";

  const formatted = new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(Math.abs(Math.round(value)));

  return `${sign}₦${formatted}`;
}

export function formatNairaCompact(value: number) {
  const sign = value < 0 ? "-" : "";

  return `${sign}₦${compactFormatter.format(
    Math.abs(value),
  )}`;
}

export function formatSignedNaira(value: number) {
  if (value === 0) {
    return formatNaira(0);
  }

  return `${value > 0 ? "+" : "-"}${formatNaira(
    Math.abs(value),
  )}`;
}