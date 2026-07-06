const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 2,
});

export function formatCurrency(
  value: number | null | undefined,
) {
  return aud.format(value ?? 0);
}

export function formatCompactCurrency(
  value: number,
) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
