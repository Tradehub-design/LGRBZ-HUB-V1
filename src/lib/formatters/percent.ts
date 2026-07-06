export function formatPercent(
  value: number,
  decimals = 2,
) {
  return `${value.toFixed(decimals)}%`;
}
