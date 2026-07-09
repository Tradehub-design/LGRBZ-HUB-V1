"use client";

import { holdingAccounts, holdingRows } from "../mock-data";
import { formatHoldingMoney } from "../format";

export function AccountAllocationCard() {
  const accounts = holdingAccounts
    .filter((account) => account.id !== "all")
    .map((account) => {
      const value = holdingRows
        .filter((row) => row.accountId === account.id)
        .reduce((sum, row) => sum + row.marketValue, 0);

      return {
        ...account,
        value,
      };
    });

  const total = accounts.reduce((sum, account) => sum + account.value, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Account Allocation
      </h2>

      <div className="mt-5 space-y-4">
        {accounts.map((account) => {
          const percent = total === 0 ? 0 : (account.value / total) * 100;

          return (
            <div key={account.id}>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-950">
                    {account.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {account.broker}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-950">
                    {formatHoldingMoney(account.value)}
                  </div>

                  <div className="text-xs text-slate-500">
                    {percent.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-950"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
