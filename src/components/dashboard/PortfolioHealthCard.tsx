"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function PortfolioHealthCard() {
  const { healthScore, riskScore } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">Portfolio Health</p>
      <p className="mt-2 text-3xl font-bold">{healthScore}/100</p>
      <p className="mt-1 text-sm text-muted-foreground">Risk score {riskScore}</p>
    </div>
  );
}
