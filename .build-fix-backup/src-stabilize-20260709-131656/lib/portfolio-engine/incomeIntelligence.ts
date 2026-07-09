import type { DividendRecord } from "./types";

export type IncomeInsight = {
  id: string;
  title: string;
  detail: string;
  severity: "good" | "watch" | "risk";
};

export function buildIncomeInsights(params: {
  dividends: DividendRecord[];
  annualisedIncomeAud: number;
  incomeYieldPercent: number;
  monthlyAverageAud: number;
}): IncomeInsight[] {
  const insights: IncomeInsight[] = [];

  if (params.incomeYieldPercent >= 4) {
    insights.push({
      id: "yield-strong",
      title: "Strong income yield",
      detail: "Annualised dividend yield is currently in a strong range.",
      severity: "good",
    });
  } else if (params.incomeYieldPercent >= 2) {
    insights.push({
      id: "yield-moderate",
      title: "Moderate income yield",
      detail: "Dividend yield is developing but may not yet be a major return driver.",
      severity: "watch",
    });
  } else {
    insights.push({
      id: "yield-low",
      title: "Low income yield",
      detail: "Dividend yield is low relative to invested capital.",
      severity: "risk",
    });
  }

  if (params.dividends.length < 5) {
    insights.push({
      id: "income-history-short",
      title: "Short dividend history",
      detail: "There are limited dividend records, so income forecasting may be less reliable.",
      severity: "watch",
    });
  }

  if (params.monthlyAverageAud > 0) {
    insights.push({
      id: "monthly-income",
      title: "Monthly income baseline active",
      detail: "Historical dividends are sufficient to estimate a monthly income baseline.",
      severity: "good",
    });
  }

  return insights;
}
