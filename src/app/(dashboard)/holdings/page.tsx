"use client";

import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function HoldingsPage() {
  const data = useDashboardData();
  const holdings = data.enhancedHoldings ?? data.holdings ?? [];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Holdings</h1>

      <div className="rounded-xl border p-4">
        <div className="space-y-3">
          {holdings.length === 0 ? (
            <p className="text-sm text-slate-400">No holdings loaded yet.</p>
          ) : (
            holdings.map((holding: any) => (
              <div key={holding.id ?? holding.ticker} className="rounded-xl border p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{holding.ticker}</p>
                    <p className="text-sm text-slate-400">{holding.platform} · {holding.sector} · {holding.assetClass}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(holding.marketValueAud ?? holding.valueAud ?? 0).toLocaleString()}</p>
                    <p className="text-sm text-slate-400">{Number(holding.unrealisedPlPercent ?? 0).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
