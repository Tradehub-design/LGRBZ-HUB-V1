"use client";

import { Calculator, Shield, Target, Wallet } from "lucide-react";
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

export default function PositionSizingPage() {
  useSeedPortfolio();
  const data = useDashboardData();
  const sizing = data.positionSizing;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Business Suite"
        title="Position Sizing"
        description="Position sizing guide based on portfolio value and risk limits."
        actions={
          <>
            <WorkspaceLink href="/business-model">Business Model</WorkspaceLink>
            <WorkspaceLink href="/portfolio-health">Health</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Wallet />} label="Portfolio Value" value={formatMoney(sizing.portfolioValueAud)} tone="blue" />
        <PremiumStatCard icon={<Target />} label="Max Position" value={formatMoney(sizing.maxPositionAud)} helper={formatPercent(sizing.riskPercent)} tone="purple" />
        <PremiumStatCard icon={<Calculator />} label="Starter Position" value={formatMoney(sizing.suggestedStarterAud)} tone="green" />
        <PremiumStatCard icon={<Shield />} label="High Risk Max" value={formatMoney(sizing.maxHighRiskAud)} tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="Sizing Rules">
        <div className="grid gap-3 md:grid-cols-3">
          <Rule title="Starter position" value={formatMoney(sizing.suggestedStarterAud)} detail="Suggested size for new ideas or test positions." />
          <Rule title="Standard max" value={formatMoney(sizing.maxPositionAud)} detail="Maximum position size under default risk settings." />
          <Rule title="High-risk max" value={formatMoney(sizing.maxHighRiskAud)} detail="Suggested maximum for speculative holdings." />
        </div>
      </WorkspacePanel>

      <WorkspacePanel title="Current Top Holdings">
        <div className="space-y-3">
          {data.topHoldings.slice(0, 8).map((holding) => (
            <div key={holding.id} className="flex items-center justify-between rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              <div>
                <p className="font-semibold text-white">{holding.ticker}</p>
                <p className="text-xs text-slate-500">{holding.sector}</p>
              </div>
              <StatusPill tone={holding.marketValueAud > sizing.maxPositionAud ? "rose" : "green"}>
                {holding.marketValueAud > sizing.maxPositionAud ? "Above guide" : "Within guide"}
              </StatusPill>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}

function Rule({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-[#173047] bg-[#0b1e30] p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-xl font-semibold text-sky-300">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  );
}
