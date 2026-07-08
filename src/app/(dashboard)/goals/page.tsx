"use client";

import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
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

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Planning Workspace"
        title="Goals"
        description="Track portfolio, dividend income, cash reserve and long-term financial goals."
        actions={<WorkspaceLink href="/dashboard">Dashboard</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <MetricTile label="Portfolio Goal" value={formatMoney(portfolioGoal)} helper={`${formatPercent((data.totalValueAud / portfolioGoal) * 100)} complete`} />
        <MetricTile label="Current Value" value={formatMoney(data.totalValueAud)} />
        <MetricTile label="Income Goal" value={formatMoney(incomeGoal)} helper={`${formatPercent((data.totalDividendsAud / incomeGoal) * 100)} complete`} />
        <MetricTile label="Cash Goal" value={formatMoney(cashGoal)} helper={`${formatPercent((data.totalCashAud / cashGoal) * 100)} complete`} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Goal Progress">
          <div className="space-y-4">
            <ProgressRow label="Portfolio Value" value={`${formatMoney(data.totalValueAud)} / ${formatMoney(portfolioGoal)}`} percent={(data.totalValueAud / portfolioGoal) * 100} />
            <ProgressRow label="Dividend Income" value={`${formatMoney(data.totalDividendsAud)} / ${formatMoney(incomeGoal)}`} percent={(data.totalDividendsAud / incomeGoal) * 100} tone="emerald" />
            <ProgressRow label="Cash Reserve" value={`${formatMoney(data.totalCashAud)} / ${formatMoney(cashGoal)}`} percent={(data.totalCashAud / cashGoal) * 100} tone="sky" />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Goal Notes">
          <div className="space-y-3">
            <Note title="Portfolio growth" text="Live prices will improve progress accuracy in v2.0." />
            <Note title="Income target" text="Dividend forecast will use forward estimates after live market data is connected." />
            <Note title="Cash reserve" text="Cash target is currently based on cash accounts calculated from the ledger." />
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function Note({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{text}</p>
    </div>
  );
}
