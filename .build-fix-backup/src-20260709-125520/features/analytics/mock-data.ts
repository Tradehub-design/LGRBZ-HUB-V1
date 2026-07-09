import type { AnalyticsBreakdownRow, AnalyticsPoint } from "./types";

export const analyticsCurve: AnalyticsPoint[] = [
  { date: "2026-01-01", value: 100000, pnl: 0, returnPercent: 0 },
  { date: "2026-02-01", value: 104250, pnl: 4250, returnPercent: 4.25 },
  { date: "2026-03-01", value: 101900, pnl: 1900, returnPercent: 1.9 },
  { date: "2026-04-01", value: 112430, pnl: 12430, returnPercent: 12.43 },
  { date: "2026-05-01", value: 119280, pnl: 19280, returnPercent: 19.28 },
  { date: "2026-06-01", value: 123760, pnl: 23760, returnPercent: 23.76 },
  { date: "2026-07-01", value: 128420.72, pnl: 28420.72, returnPercent: 28.42 },
];

export const accountBreakdown: AnalyticsBreakdownRow[] = [
  { label: "Main Portfolio", value: 68420.12, pnl: 10020.12, returnPercent: 17.16, weight: 53.28 },
  { label: "ETF Builder", value: 31860.2, pnl: 4980.2, returnPercent: 18.53, weight: 24.81 },
  { label: "Baby Portfolio", value: 7820.4, pnl: 680.4, returnPercent: 9.53, weight: 6.09 },
  { label: "Cash Reserve", value: 20320, pnl: 0, returnPercent: 0, weight: 15.82 },
];

export const sectorBreakdown: AnalyticsBreakdownRow[] = [
  { label: "Broad Market", value: 45220, pnl: 6120.2, returnPercent: 15.65, weight: 35.21 },
  { label: "Technology", value: 34180, pnl: 8420.2, returnPercent: 32.69, weight: 26.61 },
  { label: "Financials", value: 27840, pnl: 2784.6, returnPercent: 11.11, weight: 21.68 },
  { label: "Healthcare", value: 12630, pnl: 942.48, returnPercent: 8.06, weight: 9.83 },
  { label: "Cash", value: 8550.72, pnl: 0, returnPercent: 0, weight: 6.67 },
];
