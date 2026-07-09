import type { DividendRecord } from "./types";

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value || 0) * factor) / factor;
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return round((value / total) * 100, 2);
}

export type IncomeMetrics = {
  totalIncomeAud: number;
  monthlyAverageAud: number;
  annualisedIncomeAud: number;
  incomeYieldPercent: number;
  incomeRecords: number;
  incomeHoldings: number;
  bestIncomeTicker: string;
  bestIncomeAmountAud: number;
};

export function calculateIncomeMetrics(params: {
  dividends: DividendRecord[];
  investedCostAud: number;
}): IncomeMetrics {
  const totalIncomeAud = round(
    params.dividends.reduce((sum, dividend) => sum + dividend.amountAud, 0),
  );

  const byMonth = new Map<string, number>();
  const byTicker = new Map<string, number>();

  params.dividends.forEach((dividend) => {
    byMonth.set(dividend.date.slice(0, 7), (byMonth.get(dividend.date.slice(0, 7)) ?? 0) + dividend.amountAud);
    byTicker.set(dividend.ticker, (byTicker.get(dividend.ticker) ?? 0) + dividend.amountAud);
  });

  const monthlyAverageAud = byMonth.size ? round(totalIncomeAud / byMonth.size) : 0;
  const annualisedIncomeAud = round(monthlyAverageAud * 12);

  const topTicker = [...byTicker.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    totalIncomeAud,
    monthlyAverageAud,
    annualisedIncomeAud,
    incomeYieldPercent: percent(annualisedIncomeAud, params.investedCostAud),
    incomeRecords: params.dividends.length,
    incomeHoldings: byTicker.size,
    bestIncomeTicker: topTicker?.[0] ?? "N/A",
    bestIncomeAmountAud: round(topTicker?.[1] ?? 0),
  };
}
