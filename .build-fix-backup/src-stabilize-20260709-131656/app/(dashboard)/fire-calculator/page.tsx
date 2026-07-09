"use client";

import { Flame, Landmark, Target, Wallet } from "lucide-react";
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

export default function FireCalculatorPage() {
  useSeedPortfolio();
  const data = useDashboardData();
  const fire = data.fireProjection;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Business Suite"
        title="FIRE Calculator"
        description="Financial independence target based on annual expenses and safe withdrawal assumptions."
        actions={
          <>
            <WorkspaceLink href="/retirement-planner">Retirement</WorkspaceLink>
            <WorkspaceLink href="/business-model">Business Model</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Flame />} label="FIRE Number" value={formatMoney(fire.fireNumberAud)} tone="amber" />
        <PremiumStatCard icon={<Wallet />} label="Current Portfolio" value={formatMoney(fire.currentPortfolioAud)} tone="blue" />
        <PremiumStatCard icon={<Target />} label="Progress" value={formatPercent(fire.progressPercent)} tone="green" />
        <PremiumStatCard icon={<Landmark />} label="Gap Remaining" value={formatMoney(fire.gapAud)} tone="purple" />
      </WorkspaceGrid>

      <WorkspacePanel title="FIRE Progress">
        <div className="space-y-4">
          <ProgressRow
            label="Portfolio vs FIRE Number"
            value={`${formatMoney(fire.currentPortfolioAud)} / ${formatMoney(fire.fireNumberAud)}`}
            percent={fire.progressPercent}
            tone="emerald"
          />
          <ProgressRow
            label="Annual Expense Coverage"
            value={formatMoney(fire.annualExpenseAud)}
            percent={Math.min((data.incomeMetrics.annualisedIncomeAud / fire.annualExpenseAud) * 100, 100)}
            tone="sky"
          />
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
