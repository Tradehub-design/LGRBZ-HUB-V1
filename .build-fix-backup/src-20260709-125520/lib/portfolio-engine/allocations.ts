import type { AllocationSlice, CalculatedHolding } from "./types";
import { percentage, round, sum } from "@/utils/math";

export function calculateAllocations(holdings: CalculatedHolding[]) {
  const openHoldings = holdings.filter((holding) => holding.status === "Open");

  return {
    assetClass: createSlices(openHoldings, (holding) => holding.assetClass),
    sector: createSlices(openHoldings, (holding) => holding.sector || "Others"),
    country: createSlices(openHoldings, (holding) => holding.country || "Unknown"),
    risk: createSlices(openHoldings, (holding) => holding.risk || "Unrated"),
    currency: createSlices(openHoldings, (holding) => holding.currency),
    platform: createSlices(openHoldings, (holding) => holding.platform || "Unknown"),
  };
}

function createSlices(
  holdings: CalculatedHolding[],
  getLabel: (holding: CalculatedHolding) => string,
): AllocationSlice[] {
  const map = new Map<string, number>();

  for (const holding of holdings) {
    const label = getLabel(holding);
    const value = Math.max(holding.totalCostAud, 0);
    map.set(label, (map.get(label) ?? 0) + value);
  }

  const total = sum(Array.from(map.values()));

  return Array.from(map.entries())
    .map(([label, value]) => ({
      label,
      value: round(value, 2),
      percent: round(percentage(value, total), 2),
    }))
    .sort((a, b) => b.value - a.value);
}
