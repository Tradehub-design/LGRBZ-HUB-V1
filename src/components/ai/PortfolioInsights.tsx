"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function PortfolioInsights() {
  const { holdings, healthScore, riskScore } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="font-semibold">Portfolio Insights</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {holdings.length} holdings tracked. Health {healthScore}/100. Risk {riskScore}.
      </p>
    </div>
  );
}
