import { getTransactionTotal } from "@/lib/portfolio/safeTransaction";
import type { DividendRecord, LedgerRow } from "./types";

export type FinancialYearSummary = {
  financialYear: string;
  buysAud: number;
  sellsAud: number;
  dividendsAud: number;
  feesAud: number;
  interestAud: number;
  transactionCount: number;
};

function getFinancialYear(date: string) {
  const parsed = new Date(date);
  const year = parsed.getFullYear();
  const month = parsed.getMonth() + 1;
  return month >= 7 ? `FY${year + 1}` : `FY${year}`;
}

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateFinancialYears(params: {
  transactions: LedgerRow[];
  dividends: DividendRecord[];
}): FinancialYearSummary[] {
  const map = new Map<string, FinancialYearSummary>();

  function getRow(date: string) {
    const fy = getFinancialYear(date);

    if (!map.has(fy)) {
      map.set(fy, {
        financialYear: fy,
        buysAud: 0,
        sellsAud: 0,
        dividendsAud: 0,
        feesAud: 0,
        interestAud: 0,
        transactionCount: 0,
      });
    }

    return map.get(fy)!;
  }

  params.transactions.forEach((tx) => {
    const row = getRow(tx.date);
    row.transactionCount += 1;

    if (tx.action === "Buy") row.buysAud += getTransactionTotal(tx);
    if (tx.action === "Sell") row.sellsAud += getTransactionTotal(tx);
    if (tx.action === "Fee") row.feesAud += Math.abs(getTransactionTotal(tx) || tx.fiatFees);
    if (tx.action === "Cash Interest") row.interestAud += getTransactionTotal(tx);
  });

  params.dividends.forEach((dividend) => {
    const row = getRow(dividend.date);
    row.dividendsAud += dividend.amountAud;
  });

  return [...map.values()]
    .map((row) => ({
      ...row,
      buysAud: round(row.buysAud),
      sellsAud: round(row.sellsAud),
      dividendsAud: round(row.dividendsAud),
      feesAud: round(row.feesAud),
      interestAud: round(row.interestAud),
    }))
    .sort((a, b) => b.financialYear.localeCompare(a.financialYear));
}
