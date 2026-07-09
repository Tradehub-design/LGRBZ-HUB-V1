"use client";

import type { InvestmentAccount } from "../types";
import {
  formatAccountMoney,
  formatAccountPercent,
} from "../format";

type AccountDetailDrawerProps = {
  account: InvestmentAccount | null;
  onClose: () => void;
};

export function AccountDetailDrawer({
  account,
  onClose,
}: AccountDetailDrawerProps) {
  if (!account) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30">
      <button
        type="button"
        aria-label="Close account detail"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              {account.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {account.broker} · {account.type}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Current Value
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-950">
              {formatAccountMoney(account.currentValue, account.currency)}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Return
            </div>
            <div className="mt-2 text-2xl font-semibold text-emerald-700">
              {formatAccountPercent(account.totalReturnPercent)}
            </div>
          </div>
        </div>

        <div className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200">
          {[
            ["Broker", account.broker],
            ["Type", account.type],
            ["Currency", account.currency],
            ["Opening Balance", formatAccountMoney(account.openingBalance)],
            ["Invested Amount", formatAccountMoney(account.investedAmount)],
            ["Cash Balance", formatAccountMoney(account.cashBalance)],
            ["Unrealised P/L", formatAccountMoney(account.unrealisedPnl)],
            ["Realised P/L", formatAccountMoney(account.realisedPnl)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <span className="text-slate-500">{label}</span>
              <span className="font-semibold text-slate-950">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
