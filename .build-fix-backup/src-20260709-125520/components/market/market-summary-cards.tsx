"use client";

import { Activity, ArrowDownRight, ArrowUpRight, BarChart3 } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import type { MarketSummary } from "@/lib/market/summary";

export function MarketSummaryCards({ summary }: { summary: MarketSummary }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <PremiumStatCard icon={<Activity />} label="Quotes" value={String(summary.quoteCount)} tone="blue" />
      <PremiumStatCard icon={<ArrowUpRight />} label="Gainers" value={String(summary.gainers)} tone="green" />
      <PremiumStatCard icon={<ArrowDownRight />} label="Losers" value={String(summary.losers)} tone="rose" />
      <PremiumStatCard icon={<BarChart3 />} label="Average Change" value={`${summary.averageChangePercent}%`} tone="purple" />
    </div>
  );
}
