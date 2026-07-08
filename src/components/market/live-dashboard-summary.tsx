"use client";

import { Activity, TrendingUp, Wallet } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { useLivePortfolioValuation } from "@/hooks/useLivePortfolioValuation";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";

export function LiveDashboardSummary() {
  const data = useLivePortfolioValuation();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <PremiumStatCard icon={<Wallet />} label="Live Total Value" value={formatMoney(data.liveValuation.totalValueAud, 2)} tone="blue" />
      <PremiumStatCard icon={<Activity />} label="Live Market Value" value={formatMoney(data.liveValuation.marketValueAud, 2)} tone="green" />
      <PremiumStatCard icon={<TrendingUp />} label="Live Unrealised P/L" value={formatMoney(data.liveValuation.unrealisedPlAud, 2)} helper={formatPercent(data.liveValuation.unrealisedPlPercent)} tone={data.liveValuation.unrealisedPlAud >= 0 ? "green" : "rose"} />
      <PremiumStatCard label="Quotes Loaded" value={String(data.quotes.length)} helper={data.loading ? "Loading" : "Ready"} tone="purple" />
    </div>
  );
}
