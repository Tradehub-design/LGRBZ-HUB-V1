export function formatPercentage(
  value: number,
  decimals = 2
) {
  return `${value.toFixed(decimals)}%`;
}
