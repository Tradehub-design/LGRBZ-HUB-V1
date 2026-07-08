"use client";

import { Activity, LineChart, TrendingUp } from "lucide-react";
import { PriceChart } from "@/components/market/price-chart";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { buildDemoCandles } from "@/lib/market/charts/candles";
import { calculateTechnicalSnapshot } from "@/lib/market/indicators";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function TechnicalsPage() {
  const candles = buildDemoCandles();
  const snapshot = calculateTechnicalSnapshot("VAS", candles);

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Market Intelligence"
        title="Technicals"
        description="Technical indicator workspace with moving averages and trend signals."
        actions={
          <>
            <WorkspaceLink href="/company">Company Research</WorkspaceLink>
            <WorkspaceLink href="/market-watchlist">Watchlist</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<LineChart />} label="Last Close" value={`$${snapshot.lastClose}`} tone="blue" />
        <PremiumStatCard icon={<Activity />} label="SMA 20" value={`$${snapshot.sma20}`} tone="purple" />
        <PremiumStatCard icon={<Activity />} label="SMA 50" value={`$${snapshot.sma50}`} tone="amber" />
        <PremiumStatCard icon={<TrendingUp />} label="Trend" value={snapshot.trend} helper={snapshot.momentum} tone={snapshot.trend === "Bullish" ? "green" : snapshot.trend === "Bearish" ? "rose" : "blue"} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <WorkspacePanel title="Price Chart">
          <PriceChart />
        </WorkspacePanel>

        <WorkspacePanel title="Signal Register">
          <div className="space-y-3">
            <Signal label="Trend" value={snapshot.trend} />
            <Signal label="Momentum" value={snapshot.momentum} />
            <Signal label="SMA 20" value={`$${snapshot.sma20}`} />
            <Signal label="SMA 50" value={`$${snapshot.sma50}`} />
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <span className="text-sm text-slate-400">{label}</span>
      <StatusPill tone={value === "Bullish" || value === "Strong" ? "green" : value === "Bearish" || value === "Weak" ? "rose" : "blue"}>
        {value}
      </StatusPill>
    </div>
  );
}
