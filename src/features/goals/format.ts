export function formatGoalMoney(value: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatGoalPercent(value: number) {
  return `${value.toFixed(2)}%`;
}
