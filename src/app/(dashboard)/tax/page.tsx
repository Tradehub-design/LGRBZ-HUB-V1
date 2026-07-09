"use client";

import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function TaxPage() {
  const data = useDashboardData();
  const transactions = data.transactions ?? [];
  const cgt = data.cgtSummary ?? {};
  const discounts = data.discountSummary ?? {};
  const franking = data.frankingSummary ?? {};

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Tax Centre</h1>

      <div className="grid gap-3 md:grid-cols-3">
        <TaxStat label="Net Capital Gain" value={cgt.netCapitalGainAud ?? 0} />
        <TaxStat label="Discounted Gain" value={discounts.discountedAmountAud ?? 0} />
        <TaxStat label="Franking Credits" value={franking.frankingCreditsAud ?? 0} />
      </div>

      <div className="rounded-xl border p-4">
        <h2 className="font-semibold">Recent Tax Transactions</h2>
        <div className="mt-3 space-y-2">
          {transactions.slice(0, 10).map((tx: any) => (
            <div key={tx.id} className="flex justify-between rounded-lg border p-3 text-sm">
              <span>{tx.date} · {tx.action} · {tx.ticker ?? tx.assetTicker}</span>
              <span>${Number(tx.amountAud ?? tx.totalAud ?? 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TaxStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold">${Number(value).toLocaleString()}</p>
    </div>
  );
}
