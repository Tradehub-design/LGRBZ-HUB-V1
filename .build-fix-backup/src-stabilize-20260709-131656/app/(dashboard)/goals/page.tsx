"use client";

import { Flag, PiggyBank, Target, TrendingUp } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function GoalsPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const portfolioGoal = data.goals.find((goal) => goal.id === "portfolio-250k");
  const incomeGoal = data.goals.find((goal) => goal.id === "income-12k");
  const cashGoal = data.goals.find((goal) => goal.id === "cash-10k");
  const retirementGoal = data.goals.find((goal) => goal.id === "retirement");

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Planning Workspace"
        title="Goals"
        description="Track portfolio, dividend income, cash reserve and long-term financial goals."
        actions={
          <>
            <WorkspaceLink href="/dashboard">Dashboard</WorkspaceLink>
            <WorkspaceLink href="/retirement-planner">Retirement</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Target />} label="Portfolio Goal" value={formatMoney(portfolioGoal?.targetAud ?? 0)} helper={`${formatPercent(portfolioGoal?.progressPercent ?? 0)} complete`} tone="blue" />
        <PremiumStatCard icon={<TrendingUp />} label="Current Value" value={formatMoney(data.totalValueAud)} tone="green" />
        <PremiumStatCard icon={<PiggyBank />} label="Income Goal" value={formatMoney(incomeGoal?.targetAud ?? 0)} helper={`${formatPercent(incomeGoal?.progressPercent ?? 0)} complete`} tone="purple" />
        <PremiumStatCard icon={<Flag />} label="Retirement Goal" value={formatPercent(retirementGoal?.progressPercent ?? 0)} helper={formatMoney(retirementGoal?.gapAud ?? 0)} tone="amber" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <WorkspacePanel title="Goal Progress">
          <div className="space-y-4">
            {data.goals.map((goal) => (
              <ProgressRow
                key={goal.id}
                label={goal.title}
                value={`${formatMoney(goal.currentAud)} / ${formatMoney(goal.targetAud)}`}
                percent={goal.progressPercent}
                tone={goal.category === "Income" ? "emerald" : goal.category === "Cash" ? "sky" : goal.category === "Retirement" ? "amber" : "violet"}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Goal Register">
          <div className="space-y-3">
            {data.goals.map((goal) => (
              <div key={goal.id} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{goal.title}</p>
                  <StatusPill tone={goal.progressPercent >= 80 ? "green" : goal.progressPercent >= 40 ? "amber" : "blue"}>
                    {formatPercent(goal.progressPercent)}
                  </StatusPill>
                </div>
                <p className="mt-2 text-sm text-slate-400">Remaining: {formatMoney(goal.gapAud)}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
