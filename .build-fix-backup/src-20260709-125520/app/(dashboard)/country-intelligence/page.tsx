"use client";

import { Globe2 } from "lucide-react";
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

export default function CountryIntelligencePage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const largest = data.allocation.country[0];

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Intelligence Layer"
        title="Country Intelligence"
        description="Analyse geographic exposure and country concentration."
        actions={
          <>
            <WorkspaceLink href="/sector-intelligence">Sectors</WorkspaceLink>
            <WorkspaceLink href="/portfolio-allocation">Allocation</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Globe2 />} label="Countries" value={String(data.allocation.country.length)} tone="blue" />
        <PremiumStatCard label="Largest Country" value={largest?.label ?? "N/A"} helper={largest ? formatPercent(largest.percent) : undefined} tone="amber" />
        <PremiumStatCard label="High Exposure" value={String(data.countryInsights.filter((x) => x.severity === "risk").length)} tone="rose" />
        <PremiumStatCard label="Watch Items" value={String(data.countryInsights.filter((x) => x.severity === "watch").length)} tone="purple" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <WorkspacePanel title="Country Chart">
          <HorizontalBarChart
            data={data.allocation.country.slice(0, 10).map((row) => ({
              label: row.label,
              value: row.value,
            }))}
          />
        </WorkspacePanel>

        <WorkspacePanel title="Country Insights">
          <div className="space-y-3">
            {data.countryInsights.map((item) => (
              <div key={item.id} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{item.country}</p>
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

      <WorkspacePanel title="Country Values">
        <div className="grid gap-3 md:grid-cols-3">
          {data.allocation.country.map((country) => (
            <div key={country.label} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              <p className="text-sm font-semibold text-white">{country.label}</p>
              <p className="mt-1 text-sm text-slate-400">{formatMoney(country.value)} · {formatPercent(country.percent)}</p>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
