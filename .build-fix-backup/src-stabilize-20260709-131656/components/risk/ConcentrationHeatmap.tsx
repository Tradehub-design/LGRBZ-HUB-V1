"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function ConcentrationHeatmap() {
  const { portfolio } = usePortfolio();

  if (!portfolio) return null;

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="mb-4 font-semibold">Portfolio Concentration</h2>
      <div className="grid grid-cols-5 gap-3">
        {portfolio.holdings.map(h => (
          <div key={h.ticker} className="rounded-lg border p-4 text-center">
            <div>{h.ticker}</div>
            <div className="mt-2">{h.metrics.allocationPercent.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
