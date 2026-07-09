"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function PortfolioSummary() {
  const { portfolioValue, totalReturn, totalReturnPercent, holdings } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">Portfolio Summary</p>
      <p className="mt-2 text-3xl font-bold">${portfolioValue.toLocaleString()}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Return ${totalReturn.toLocaleString()} · {totalReturnPercent.toFixed(2)}%
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{holdings.length} open holdings</p>
    </div>
  );
}
