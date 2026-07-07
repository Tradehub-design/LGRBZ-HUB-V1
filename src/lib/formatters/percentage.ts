export function formatPercentage(
  value: number | null | undefined,
  decimals = 2
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0.00%";
  }

  return `${value.toFixed(decimals)}%`;
}
