import { getTransactionTotal } from "@/lib/portfolio/safeTransaction";
import type {
  CashAccount,
  CalculatedHolding,
  DividendRecord,
  LedgerRow,
  PortfolioEngineResult,
} from "./types";

export function buildSummary(
  rows: LedgerRow[],
  holdings: CalculatedHolding[],
  cash: CashAccount[],
  dividends: DividendRecord[],
): PortfolioEngineResult["summary"] {
  return {
    totalCostAud: holdings.reduce(
      (a, b) => a + b.totalCostAud,
      0,
    ),

    totalCashAud: cash.reduce(
      (a, b) => a + b.balanceAud,
      0,
    ),

    totalDividendsAud: dividends.reduce(
      (a, b) => a + b.amountAud,
      0,
    ),

    realisedPlAud: holdings.reduce(
      (a, b) => a + b.realisedPlAud,
      0,
    ),

    depositsAud: rows
      .filter((r) => r.action === "Cash Deposit")
      .reduce(
        (a, b) =>
          a +
          (getTransactionTotal(b) ||
            b.totalAud),
        0,
      ),

    withdrawalsAud: rows
      .filter(
        (r) =>
          r.action === "Cash Withdrawal",
      )
      .reduce(
        (a, b) =>
          a +
          (getTransactionTotal(b) ||
            b.totalAud),
        0,
      ),

    feesAud: rows
      .filter((r) => r.action === "Fee")
      .reduce(
        (a, b) =>
          a +
          (getTransactionTotal(b) ||
            b.totalAud),
        0,
      ),

    openHoldingsCount: holdings.filter(
      (x) => x.status === "Open",
    ).length,

    closedHoldingsCount: holdings.filter(
      (x) => x.status === "Closed",
    ).length,

    transactionCount: rows.length,
  };
}
