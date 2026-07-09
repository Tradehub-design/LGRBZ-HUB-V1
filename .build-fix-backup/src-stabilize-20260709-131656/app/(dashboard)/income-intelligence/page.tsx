"use client";

import { BadgeDollarSign } from "lucide-react";
import { IncomeBarChart } from "@/components/workspace/portfolio-charts";
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

export default function IncomeIntelligencePage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const monthly = data.dividends.reduce<Record<string, number>>((acc, item) => {
    const month = item.date.slice(0, 7);
    acc[month] = (acc[month] ?? 0) + item.amountAud;
    return acc;
  }, {});

  const chartData = Object.entries(monthly)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Intelligence Layer"
        title="Income Intelligence"
        description="Analyse dividend reliability, yield and income trajectory."
        actions={
          <>
            <WorkspaceLink href="/dividends">Dividends</WorkspaceLink>
            <WorkspaceLink href="/dividend-forecast">Forecast</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<BadgeDollarSign />} label="Annualised Income" value={formatMoney(data.incomeMetrics.annualisedIncomeAud, 2)} tone="green" />
        <PremiumStatCard label="Monthly Average" value={formatMoney(data.incomeMetrics.monthlyAverageAud, 2)} tone="blue" />
        <PremiumStatCard label="Income Yield" value={formatPercent(data.incomeMetrics.incomeYieldPercent)} tone="purple" />
        <PremiumStatCard label="Income Holdings" value={String(data.incomeMetrics.incomeHoldings)} tone="amber" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <WorkspacePanel title="Income Chart">
          <IncomeBarChart data={chartData.map((item) => ({ month: item.month, amount: Number(item.amount ?? 0) }))} />
        </WorkspacePanel>

        <WorkspacePanel title="Income Insights">
          <div className="space-y-3">
            {data.incomeInsights.map((item) => (
              <div key={item.id} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
                <StatusPill tone={item.severity === "good" ? "green" : item.severity === "watch" ? "amber" : "rose"}>
                  {item.severity}
                </StatusPill>
                <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
