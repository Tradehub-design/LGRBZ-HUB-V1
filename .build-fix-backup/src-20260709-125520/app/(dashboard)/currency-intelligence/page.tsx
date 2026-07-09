"use client";

import { CircleDollarSign } from "lucide-react";
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

export default function CurrencyIntelligencePage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const largest = data.allocation.currency[0];

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Intelligence Layer"
        title="Currency Intelligence"
        description="Analyse currency exposure and foreign exchange concentration."
        actions={<WorkspaceLink href="/portfolio-allocation">Allocation</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<CircleDollarSign />} label="Currencies" value={String(data.allocation.currency.length)} tone="blue" />
        <PremiumStatCard label="Largest Currency" value={largest?.label ?? "N/A"} helper={largest ? formatPercent(largest.percent) : undefined} tone="amber" />
        <PremiumStatCard label="High Exposure" value={String(data.currencyInsights.filter((x) => x.severity === "risk").length)} tone="rose" />
        <PremiumStatCard label="Watch Items" value={String(data.currencyInsights.filter((x) => x.severity === "watch").length)} tone="purple" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <WorkspacePanel title="Currency Chart">
          <HorizontalBarChart
            data={data.allocation.currency.map((row) => ({
              label: row.label,
              value: row.value,
            }))}
          />
        </WorkspacePanel>

        <WorkspacePanel title="Currency Insights">
          <div className="space-y-3">
            {data.currencyInsights.map((item) => (
              <div key={item.id} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{item.currency}</p>
                  <StatusPill tone={item.severity === "risk" ? "rose" : item.severity === "watch" ? "amber" : "green"}>
                    {formatPercent(item.percent)}
                  </StatusPill>
                </div>
                <p className="mt-2 text-sm text-slate-400">{item.message}</p>
                <p className="mt-1 text-xs text-slate-500">{formatMoney(data.allocation.currency.find((x) => x.label === item.currency)?.value ?? 0)}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
