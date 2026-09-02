export function formatNumberInput(value: number) {
  if (!value) return "";

  return new Intl.NumberFormat("en-US").format(value);
}

export function parseNumberInput(value: string) {
  const cleaned = value.replace(/[^\d]/g, "");

  return Number(cleaned) || 0;
}