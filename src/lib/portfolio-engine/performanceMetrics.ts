import { getTransactionTotal } from "@/lib/portfolio/safeTransaction";
import type { DividendRecord, LedgerRow } from "./types";

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value || 0) * factor) / factor;
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return round((value / total) * 100, 2);
}

export type PortfolioPerformanceMetrics = {
  buyValueAud: number;
  sellValueAud: number;
  netInvestedAud: number;
  dividendIncomeAud: number;
  feesAud: number;
  depositsAud: number;
  withdrawalsAud: number;
  netCashFlowAud: number;
  incomeReturnPercent: number;
};

export function calculatePerformanceMetrics(params: {
  transactions: LedgerRow[];
  dividends: DividendRecord[];
  investedCostAud: number;
}): PortfolioPerformanceMetrics {
  const buyValueAud = params.transactions
    .filter((tx) => tx.action === "Buy")
    .reduce((sum, tx) => sum + getTransactionTotal(tx), 0);

  const sellValueAud = params.transactions
    .filter((tx) => tx.action === "Sell")
    .reduce((sum, tx) => sum + getTransactionTotal(tx), 0);

  const depositsAud = params.transactions
    .filter((tx) => tx.action === "Cash Deposit" || tx.action === "Transfer Deposit")
    .reduce((sum, tx) => sum + getTransactionTotal(tx), 0);

  const withdrawalsAud = params.transactions
    .filter((tx) => tx.action === "Cash Withdrawal" || tx.action === "Transfer Send")
    .reduce((sum, tx) => sum + getTransactionTotal(tx), 0);

  const feesAud = params.transactions
    .filter((tx) => tx.action === "Fee")
    .reduce((sum, tx) => sum + Math.abs(getTransactionTotal(tx) || tx.fiatFees), 0);

  const dividendIncomeAud = params.dividends.reduce((sum, dividend) => sum + dividend.amountAud, 0);

  return {
    buyValueAud: round(buyValueAud),
    sellValueAud: round(sellValueAud),
    netInvestedAud: round(buyValueAud - sellValueAud),
    dividendIncomeAud: round(dividendIncomeAud),
    feesAud: round(feesAud),
    depositsAud: round(depositsAud),
    withdrawalsAud: round(withdrawalsAud),
    netCashFlowAud: round(depositsAud - withdrawalsAud),
    incomeReturnPercent: percent(dividendIncomeAud, params.investedCostAud),
  };
}
