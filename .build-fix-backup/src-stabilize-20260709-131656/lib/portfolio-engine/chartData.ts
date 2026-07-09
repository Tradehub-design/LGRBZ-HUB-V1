import type { AllocationSlice } from "./types";
import type { EquityPoint } from "./equityCurve";
import type { PortfolioReplayPoint } from "./replay";

export type ChartPoint = {
  label: string;
  value: number;
};

export function toAllocationChartData(rows: AllocationSlice[]): ChartPoint[] {
  return rows.map((row) => ({
    label: row.label,
    value: row.value,
  }));
}

export function toEquityChartData(rows: EquityPoint[]): ChartPoint[] {
  return rows.map((row) => ({
    label: row.date,
    value: row.investedAud,
  }));
}

export function toReplayChartData(rows: PortfolioReplayPoint[]): ChartPoint[] {
  return rows.map((row) => ({
    label: row.date,
    value: row.netActivityAud,
  }));
}
