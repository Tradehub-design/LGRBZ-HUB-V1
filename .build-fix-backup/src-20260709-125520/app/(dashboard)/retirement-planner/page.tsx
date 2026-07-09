"use client";

import { Landmark, Target, TrendingUp, Wallet } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { ProgressRow } from "@/components/workspace";
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

export default function RetirementPlannerPage() {
  useSeedPortfolio();
  const data = useDashboardData();
  const projection = data.retirementProjection;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Business Suite"
        title="Retirement Planner"
        description="Track portfolio progress against an income and withdrawal-rate target."
        actions={
          <>
            <WorkspaceLink href="/business-model">Business Model</WorkspaceLink>
            <WorkspaceLink href="/goals">Goals</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Wallet />} label="Current Portfolio" value={formatMoney(projection.currentPortfolioAud)} tone="blue" />
        <PremiumStatCard icon={<Target />} label="Required Portfolio" value={formatMoney(projection.requiredPortfolioAud)} helper={`${projection.withdrawalRatePercent}% withdrawal`} tone="purple" />
        <PremiumStatCard icon={<TrendingUp />} label="Progress" value={formatPercent(projection.progressPercent)} tone="green" />
        <PremiumStatCard icon={<Landmark />} label="Gap Remaining" value={formatMoney(projection.gapAud)} tone="amber" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <WorkspacePanel title="Retirement Progress">
          <div className="space-y-4">
            <ProgressRow
              label="Portfolio Target"
              value={`${formatMoney(projection.currentPortfolioAud)} / ${formatMoney(projection.requiredPortfolioAud)}`}
              percent={projection.progressPercent}
              tone="emerald"
            />
            <ProgressRow
              label="Target Income"
              value={formatMoney(projection.targetIncomeAud)}
              percent={Math.min((data.incomeMetrics.annualisedIncomeAud / projection.targetIncomeAud) * 100, 100)}
              tone="sky"
            />
            <ProgressRow
              label="Dividend Income"
              value={formatMoney(data.incomeMetrics.annualisedIncomeAud)}
              percent={Math.min(data.incomeMetrics.incomeYieldPercent * 10, 100)}
              tone="violet"
            />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Planning Notes">
          <div className="space-y-3 text-sm text-slate-300">
            <p className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              This model uses a simple withdrawal-rate approach and does not include inflation, tax or market volatility yet.
            </p>
            <p className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              Scenario modelling and custom assumptions will be added in later bundles.
            </p>
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
