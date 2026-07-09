import type { LedgerRow } from "./types";

export type EquityPoint = {
  date: string;
  investedAud: number;
  cumulativeCashFlowAud: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateEquityCurve(transactions: LedgerRow[]): EquityPoint[] {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  let invested = 0;
  let cashFlow = 0;

  return sorted.map((tx) => {
    if (tx.action === "Buy") invested += tx.totalFeesIncludedAud;
    if (tx.action === "Sell") invested -= tx.totalFeesIncludedAud;

    if (tx.action === "Cash Deposit") cashFlow += tx.totalFeesIncludedAud;
    if (tx.action === "Cash Withdrawal") cashFlow -= tx.totalFeesIncludedAud;

    return {
      date: tx.date,
      investedAud: round(invested),
      cumulativeCashFlowAud: round(cashFlow),
    };
  });
}
