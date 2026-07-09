"use client";

import { LineChart, TrendingUp, Wallet } from "lucide-react";
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

export default function ScenarioSimulatorPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const balanced = data.scenarios.find((scenario) => scenario.name === "Balanced") ?? data.scenarios[0];

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Business Suite"
        title="Scenario Simulator"
        description="Compare long-term portfolio growth scenarios using contribution and return assumptions."
        actions={
          <>
            <WorkspaceLink href="/business-model">Business Model</WorkspaceLink>
            <WorkspaceLink href="/retirement-planner">Retirement</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Wallet />} label="Starting Value" value={formatMoney(data.totalValueAud)} tone="blue" />
        <PremiumStatCard icon={<TrendingUp />} label="Balanced Projection" value={formatMoney(balanced?.projectedValueAud ?? 0)} tone="green" />
        <PremiumStatCard icon={<LineChart />} label="Projected Gain" value={formatMoney(balanced?.projectedGainAud ?? 0)} tone="purple" />
        <PremiumStatCard label="Timeframe" value="10 Years" helper="Default scenarios" tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="Scenario Comparison">
        <div className="grid gap-4 md:grid-cols-3">
          {data.scenarios.map((scenario) => (
            <div key={scenario.name} className="rounded-xl border border-[#173047] bg-[#0b1e30] p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{scenario.name}</p>
                <StatusPill tone={scenario.name === "Growth" ? "green" : scenario.name === "Balanced" ? "blue" : "amber"}>
                  {formatPercent(scenario.annualReturnPercent)}
                </StatusPill>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <Row label="Monthly Contribution" value={formatMoney(scenario.monthlyContributionAud)} />
                <Row label="Projected Value" value={formatMoney(scenario.projectedValueAud)} />
                <Row label="Projected Gain" value={formatMoney(scenario.projectedGainAud)} />
                <Row label="Years" value={String(scenario.years)} />
              </div>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
