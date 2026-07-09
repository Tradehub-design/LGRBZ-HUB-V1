import { getTransactionTotal } from "@/lib/portfolio/safeTransaction";
import type { LedgerRow } from "./types";

export type PortfolioReplayPoint = {
  date: string;
  buysAud: number;
  sellsAud: number;
  depositsAud: number;
  withdrawalsAud: number;
  dividendsAud: number;
  feesAud: number;
  netActivityAud: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculatePortfolioReplay(transactions: LedgerRow[]): PortfolioReplayPoint[] {
  const map = new Map<string, PortfolioReplayPoint>();

  function getPoint(date: string) {
    if (!map.has(date)) {
      map.set(date, {
        date,
        buysAud: 0,
        sellsAud: 0,
        depositsAud: 0,
        withdrawalsAud: 0,
        dividendsAud: 0,
        feesAud: 0,
        netActivityAud: 0,
      });
    }

    return map.get(date)!;
  }

  transactions.forEach((tx) => {
    const point = getPoint(tx.date);
    const value = getTransactionTotal(tx);

    if (tx.action === "Buy") point.buysAud += value;
    if (tx.action === "Sell") point.sellsAud += value;
    if (tx.action === "Cash Deposit" || tx.action === "Transfer Deposit") point.depositsAud += value;
    if (tx.action === "Cash Withdrawal" || tx.action === "Transfer Send") point.withdrawalsAud += value;
    if (tx.action === "Cash Dividend") point.dividendsAud += value;
    if (tx.action === "Fee") point.feesAud += Math.abs(value || tx.fiatFees);
  });

  return [...map.values()]
    .map((point) => ({
      ...point,
      buysAud: round(point.buysAud),
      sellsAud: round(point.sellsAud),
      depositsAud: round(point.depositsAud),
      withdrawalsAud: round(point.withdrawalsAud),
      dividendsAud: round(point.dividendsAud),
      feesAud: round(point.feesAud),
      netActivityAud: round(
        point.depositsAud +
          point.dividendsAud +
          point.sellsAud -
          point.buysAud -
          point.withdrawalsAud -
          point.feesAud,
      ),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
