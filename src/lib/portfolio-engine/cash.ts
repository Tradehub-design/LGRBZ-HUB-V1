import { getTransactionTotal } from "@/lib/portfolio/safeTransaction";
import type { CashAccount, LedgerRow } from "./types";
import { round } from "@/utils/math";

export function calculateCashAccounts(rows: LedgerRow[]): CashAccount[] {
  const accounts = new Map<string, CashAccount>();

  for (const row of rows) {
    if (!isCashRelated(row)) continue;

    const key = `${row.platform}_${row.currency}`;

    const account =
      accounts.get(key) ??
      ({
        id: key,
        platform: row.platform,
        currency: row.currency,
        balance: 0,
        balanceAud: 0,
        depositsAud: 0,
        withdrawalsAud: 0,
        dividendsAud: 0,
        interestAud: 0,
        feesAud: 0,
      } satisfies CashAccount);

    const amountAud = getTransactionTotal(row) || row.totalAud || row.price || 0;
    const amount = row.totalFeesIncluded || row.total || row.price || 0;

    if (row.action === "Cash Deposit" || row.action === "Transfer Deposit") {
      account.balance += amount;
      account.balanceAud += amountAud;
      account.depositsAud += amountAud;
    }

    if (row.action === "Cash Withdrawal" || row.action === "Transfer Send") {
      account.balance -= amount;
      account.balanceAud -= amountAud;
      account.withdrawalsAud += amountAud;
    }

    if (row.action === "Cash Dividend") {
      account.balance += amount;
      account.balanceAud += amountAud;
      account.dividendsAud += amountAud;
    }

    if (row.action === "Cash Interest") {
      account.balance += amount;
      account.balanceAud += amountAud;
      account.interestAud += amountAud;
    }

    if (row.action === "Fee") {
      account.balance -= amount;
      account.balanceAud -= amountAud;
      account.feesAud += amountAud;
    }

    accounts.set(key, account);
  }

  return Array.from(accounts.values()).map((account) => ({
    ...account,
    balance: round(account.balance, 2),
    balanceAud: round(account.balanceAud, 2),
    depositsAud: round(account.depositsAud, 2),
    withdrawalsAud: round(account.withdrawalsAud, 2),
    dividendsAud: round(account.dividendsAud, 2),
    interestAud: round(account.interestAud, 2),
    feesAud: round(account.feesAud, 2),
  }));
}

function isCashRelated(row: LedgerRow) {
  return (
    row.assetClass === "Cash" ||
    row.assetTicker === "CASH" ||
    row.assetTicker === "INTEREST" ||
    row.action === "Cash Deposit" ||
    row.action === "Cash Withdrawal" ||
    row.action === "Transfer Send" ||
    row.action === "Transfer Deposit" ||
    row.action === "Cash Dividend" ||
    row.action === "Cash Interest" ||
    row.action === "Fee"
  );
}
