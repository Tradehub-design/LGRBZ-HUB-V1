export function formatHoldingMoney(value: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatHoldingPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatHoldingNumber(value: number) {
  return new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 4,
  }).format(value);
}
