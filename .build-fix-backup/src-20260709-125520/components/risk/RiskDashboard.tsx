"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function RiskDashboard() {
  const { portfolio } = usePortfolio();

  if (!portfolio) {
    return null;
  }

  const totalValue = portfolio.holdings.reduce(
    (sum, holding) => sum + holding.metrics.marketValue,
    0
  );

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Portfolio Risk Dashboard
      </h2>

      <div className="space-y-4">
        {portfolio.holdings.map((holding) => (
          <div
            key={holding.ticker}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <div className="font-semibold">{holding.ticker}</div>
              <div className="text-sm text-muted-foreground">
                ${holding.metrics.marketValue.toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold">
                {holding.metrics.allocationPercent.toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground">
                of portfolio
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between">
          <span>Total Exposure</span>
          <strong>${totalValue.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}
