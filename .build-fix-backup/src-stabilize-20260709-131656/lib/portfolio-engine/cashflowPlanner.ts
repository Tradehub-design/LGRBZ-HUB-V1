import type { LedgerRow } from "./types";

export type CashflowPlan = {
  depositsAud: number;
  withdrawalsAud: number;
  dividendsAud: number;
  netCashflowAud: number;
  monthlyAverageAud: number;
  activeMonths: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateCashflowPlan(transactions: LedgerRow[]): CashflowPlan {
  const months = new Map<string, number>();

  let depositsAud = 0;
  let withdrawalsAud = 0;
  let dividendsAud = 0;

  transactions.forEach((tx) => {
    const month = tx.date.slice(0, 7);
    let value = 0;

    if (tx.action === "Cash Deposit" || tx.action === "Transfer Deposit") {
      depositsAud += tx.totalFeesIncludedAud;
      value += tx.totalFeesIncludedAud;
    }

    if (tx.action === "Cash Withdrawal" || tx.action === "Transfer Send") {
      withdrawalsAud += tx.totalFeesIncludedAud;
      value -= tx.totalFeesIncludedAud;
    }

    if (tx.action === "Cash Dividend") {
      dividendsAud += tx.totalFeesIncludedAud;
      value += tx.totalFeesIncludedAud;
    }

    if (value !== 0) {
      months.set(month, (months.get(month) ?? 0) + value);
    }
  });

  const netCashflowAud = depositsAud + dividendsAud - withdrawalsAud;
  const activeMonths = months.size;

  return {
    depositsAud: round(depositsAud),
    withdrawalsAud: round(withdrawalsAud),
    dividendsAud: round(dividendsAud),
    netCashflowAud: round(netCashflowAud),
    monthlyAverageAud: activeMonths ? round(netCashflowAud / activeMonths) : 0,
    activeMonths,
  };
}
