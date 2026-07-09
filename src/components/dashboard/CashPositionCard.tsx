"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function CashPositionCard() {
  const { cashAccounts } = useBusinessSnapshot();

  const rows = [
    ["Cash", cashAccounts.totalCash],
    ["Deposits", cashAccounts.totalDeposits],
    ["Withdrawals", cashAccounts.totalWithdrawals],
    ["Dividends", cashAccounts.totalDividends],
    ["Interest", cashAccounts.totalInterest],
  ];

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="font-semibold">Cash Position</h3>
      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={String(label)} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">${Number(value).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
