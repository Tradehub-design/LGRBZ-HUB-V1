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

  const incomeGoal = 12000;
  const portfolioGoal = 250000;
  const cashGoal = 10000;
  const healthGoal = 85;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Planning Workspace"
        title="Goals"
        description="Track portfolio, dividend income, cash reserve and long-term financial goals."
        actions={<WorkspaceLink href="/dashboard">Dashboard</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Target />} label="Portfolio Goal" value={formatMoney(portfolioGoal)} helper={`${formatPercent((data.totalValueAud / portfolioGoal) * 100)} complete`} tone="blue" />
        <PremiumStatCard icon={<TrendingUp />} label="Current Value" value={formatMoney(data.totalValueAud)} tone="green" />
        <PremiumStatCard icon={<PiggyBank />} label="Income Goal" value={formatMoney(incomeGoal)} helper={`${formatPercent((data.totalDividendsAud / incomeGoal) * 100)} complete`} tone="purple" />
        <PremiumStatCard icon={<Flag />} label="Health Target" value={`${healthGoal}/100`} helper={`Current ${data.health.score}/100`} tone="amber" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Goal Progress">
          <div className="space-y-4">
            <ProgressRow label="Portfolio Value" value={`${formatMoney(data.totalValueAud)} / ${formatMoney(portfolioGoal)}`} percent={(data.totalValueAud / portfolioGoal) * 100} />
            <ProgressRow label="Dividend Income" value={`${formatMoney(data.totalDividendsAud)} / ${formatMoney(incomeGoal)}`} percent={(data.totalDividendsAud / incomeGoal) * 100} tone="emerald" />
            <ProgressRow label="Cash Reserve" value={`${formatMoney(data.totalCashAud)} / ${formatMoney(cashGoal)}`} percent={(data.totalCashAud / cashGoal) * 100} tone="sky" />
            <ProgressRow label="Health Score" value={`${data.health.score} / ${healthGoal}`} percent={(data.health.score / healthGoal) * 100} tone="amber" />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Goal Notes">
          <div className="space-y-3">
            <Note tone="blue" title="Portfolio growth" text="Live prices will improve progress accuracy in v2.0." />
            <Note tone="green" title="Income target" text="Dividend forecast will use forward estimates after live market data is connected." />
            <Note tone="purple" title="Cash reserve" text="Cash target is currently based on cash accounts calculated from the ledger." />
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function Note({ title, text, tone }: { title: string; text: string; tone: "blue" | "green" | "purple" }) {
  return (
    <div className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <StatusPill tone={tone}>{title}</StatusPill>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  );
}
