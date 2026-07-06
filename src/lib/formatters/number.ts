export function formatNumber(
  value: number,
  decimals = 2,
) {
  return new Intl.NumberFormat("en-AU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function wholeNumber(
  value: number,
) {
  return new Intl.NumberFormat("en-AU").format(
    value,
  );
}
