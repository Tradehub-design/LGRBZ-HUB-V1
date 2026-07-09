import type { LedgerRow } from "./types";

export type ReturnMetrics = {
  simpleReturnPercent: number;
  dividendReturnPercent: number;
  unrealisedReturnPercent: number;
  totalGainAud: number;
  totalGainPercent: number;
  averageMonthlyCashFlowAud: number;
  activityMonths: number;
};

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value || 0) * factor) / factor;
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return round((value / total) * 100, 2);
}

export function calculateReturnMetrics(params: {
  transactions: LedgerRow[];
  investedCostAud: number;
  unrealisedPlAud: number;
  realisedPlAud: number;
  dividendIncomeAud: number;
}): ReturnMetrics {
  const byMonth = new Map<string, number>();

  params.transactions.forEach((tx) => {
    const month = tx.date.slice(0, 7);
    const value = byMonth.get(month) ?? 0;

    if (tx.action === "Cash Deposit" || tx.action === "Transfer Deposit") {
      byMonth.set(month, value + tx.totalFeesIncludedAud);
    }

    if (tx.action === "Cash Withdrawal" || tx.action === "Transfer Send") {
      byMonth.set(month, value - tx.totalFeesIncludedAud);
    }
  });

  const activityMonths = byMonth.size;
  const cashFlowTotal = [...byMonth.values()].reduce((sum, value) => sum + value, 0);

  const totalGainAud = round(
    params.unrealisedPlAud + params.realisedPlAud + params.dividendIncomeAud,
  );

  return {
    simpleReturnPercent: percent(totalGainAud, params.investedCostAud),
    dividendReturnPercent: percent(params.dividendIncomeAud, params.investedCostAud),
    unrealisedReturnPercent: percent(params.unrealisedPlAud, params.investedCostAud),
    totalGainAud,
    totalGainPercent: percent(totalGainAud, params.investedCostAud),
    averageMonthlyCashFlowAud: activityMonths ? round(cashFlowTotal / activityMonths) : 0,
    activityMonths,
  };
}
