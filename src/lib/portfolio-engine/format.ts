export function formatMoney(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits,
  }).format(value || 0);
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-AU", {
    maximumFractionDigits,
  }).format(value || 0);
}

export function formatPercent(value: number, maximumFractionDigits = 2) {
  return `${formatNumber(value, maximumFractionDigits)}%`;
}
