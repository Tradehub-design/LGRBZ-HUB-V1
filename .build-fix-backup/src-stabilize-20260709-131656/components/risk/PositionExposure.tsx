"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function PositionExposure() {
  const { portfolio } = usePortfolio();

  if (!portfolio) return null;

  const rows = [...portfolio.holdings].sort(
    (a, b) => b.metrics.marketValue - a.metrics.marketValue
  );

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="mb-5 font-semibold">Position Exposure</h2>
      <div className="space-y-3">
        {rows.map(h => (
          <div key={h.ticker} className="flex justify-between border-b py-2">
            <span>{h.ticker}</span>
            <span>{h.metrics.allocationPercent.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
