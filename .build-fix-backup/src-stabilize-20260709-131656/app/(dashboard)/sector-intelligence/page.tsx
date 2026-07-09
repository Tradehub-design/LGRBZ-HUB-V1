"use client";

import { BarChart3 } from "lucide-react";
import { HorizontalBarChart } from "@/components/workspace/portfolio-charts";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function SectorIntelligencePage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const largest = data.allocation.sector[0];

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Intelligence Layer"
        title="Sector Intelligence"
        description="Analyse sector concentration, exposure and risk signals."
        actions={
          <>
            <WorkspaceLink href="/analytics">Analytics</WorkspaceLink>
            <WorkspaceLink href="/portfolio-allocation">Allocation</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<BarChart3 />} label="Sectors" value={String(data.allocation.sector.length)} tone="blue" />
        <PremiumStatCard label="Largest Sector" value={largest?.label ?? "N/A"} helper={largest ? formatPercent(largest.percent) : undefined} tone="amber" />
        <PremiumStatCard label="High Exposure" value={String(data.sectorInsights.filter((x) => x.severity === "risk").length)} tone="rose" />
        <PremiumStatCard label="Watch Items" value={String(data.sectorInsights.filter((x) => x.severity === "watch").length)} tone="purple" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <WorkspacePanel title="Sector Chart">
          <HorizontalBarChart
            data={data.allocation.sector.slice(0, 10).map((row) => ({
              label: row.label,
              value: row.value,
            }))}
          />
        </WorkspacePanel>

        <WorkspacePanel title="Sector Insights">
          <div className="space-y-3">
            {data.sectorInsights.map((item) => (
              <div key={item.id} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{item.sector}</p>
                  <StatusPill tone={item.severity === "risk" ? "rose" : item.severity === "watch" ? "amber" : "green"}>
                    {formatPercent(item.percent)}
                  </StatusPill>
                </div>
                <p className="mt-2 text-sm text-slate-400">{item.message}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </section>

      <WorkspacePanel title="Sector Values">
        <div className="grid gap-3 md:grid-cols-3">
          {data.allocation.sector.map((sector) => (
            <div key={sector.label} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              <p className="text-sm font-semibold text-white">{sector.label}</p>
              <p className="mt-1 text-sm text-slate-400">{formatMoney(sector.value)} · {formatPercent(sector.percent)}</p>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
