export const chartColors = [
  "#3B82F6",
  "#14B8A6",
  "#22C55E",
  "#EAB308",
  "#F97316",
  "#EF4444",
  "#A855F7",
  "#EC4899",
  "#06B6D4",
  "#64748B",
];

export function getChartColor(index: number) {
  return chartColors[index % chartColors.length];
}
