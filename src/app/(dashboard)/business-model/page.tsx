"use client";

import { Calculator, Landmark, LineChart, Shield, Wallet } from "lucide-react";
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

export default function BusinessModelPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const targetIncome = 60000;
  const safeWithdrawalRate = 4;
  const requiredPortfolio = targetIncome / (safeWithdrawalRate / 100);
  const progress = (data.totalValueAud / requiredPortfolio) * 100;
  const monthlyIncome = data.totalDividendsAud / 12;
  const yieldOnCost = data.totalCostAud ? (data.totalDividendsAud / data.totalCostAud) * 100 : 0;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Business Intelligence"
        title="Business Model"
        description="Risk profile, income model, capital targets and long-term portfolio planning."
        actions={
          <>
            <WorkspaceLink href="/goals">Goals</WorkspaceLink>
            <WorkspaceLink href="/portfolio-health">Health</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-5">
        <PremiumStatCard icon={<Wallet />} label="Current Portfolio" value={formatMoney(data.totalValueAud)} tone="blue" />
        <PremiumStatCard icon={<Landmark />} label="Target Portfolio" value={formatMoney(requiredPortfolio)} helper={`${safeWithdrawalRate}% withdrawal model`} tone="purple" />
        <PremiumStatCard icon={<LineChart />} label="Progress" value={formatPercent(progress)} tone="green" />
        <PremiumStatCard icon={<Calculator />} label="Dividend Monthly" value={formatMoney(monthlyIncome, 2)} tone="green" />
        <PremiumStatCard icon={<Shield />} label="Risk Score" value={`${data.risk.riskScore}/100`} helper={data.risk.concentrationLevel} tone="amber" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <WorkspacePanel title="Financial Independence Model">
          <div className="space-y-4">
            <ProgressRow label="Portfolio Target" value={`${formatMoney(data.totalValueAud)} / ${formatMoney(requiredPortfolio)}`} percent={progress} tone="emerald" />
            <ProgressRow label="Dividend Income" value={`${formatMoney(data.totalDividendsAud)} / ${formatMoney(targetIncome)}`} percent={(data.totalDividendsAud / targetIncome) * 100} tone="sky" />
            <ProgressRow label="Cash Position" value={formatPercent(data.risk.cashPercent)} percent={data.risk.cashPercent} tone="amber" />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Risk Profile">
          <div className="space-y-4">
            <ProgressRow label="Risk Score" value={`${data.risk.riskScore}/100`} percent={data.risk.riskScore} tone="amber" />
            <ProgressRow label="Largest Holding" value={formatPercent(data.risk.largestHoldingPercent)} percent={data.risk.largestHoldingPercent} tone="sky" />
            <ProgressRow label="Largest Sector" value={formatPercent(data.risk.largestSectorPercent)} percent={data.risk.largestSectorPercent} tone="violet" />
            <ProgressRow label="High Risk Exposure" value={formatPercent(data.risk.highRiskPercent)} percent={data.risk.highRiskPercent} tone="rose" />
          </div>
        </WorkspacePanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <WorkspacePanel title="Capital Model">
          <Summary label="Invested Cost" value={formatMoney(data.totalCostAud)} />
          <Summary label="Cash Available" value={formatMoney(data.totalCashAud)} />
          <Summary label="Total Value" value={formatMoney(data.totalValueAud)} />
        </WorkspacePanel>

        <WorkspacePanel title="Income Model">
          <Summary label="Dividend Income" value={formatMoney(data.totalDividendsAud, 2)} />
          <Summary label="Monthly Average" value={formatMoney(monthlyIncome, 2)} />
          <Summary label="Yield on Cost" value={formatPercent(yieldOnCost)} />
        </WorkspacePanel>

        <WorkspacePanel title="Operating Notes">
          <div className="space-y-3">
            <StatusPill tone="blue">Planning Model</StatusPill>
            <p className="text-sm text-slate-300">
              This workspace will become the home for account-level risk models, position sizing, cash flow and long-term planning.
            </p>
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 py-2 text-sm last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
