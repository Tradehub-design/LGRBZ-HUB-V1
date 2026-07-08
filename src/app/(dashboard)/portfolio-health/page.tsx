"use client";

import { HeartPulse, Shield, TrendingUp, Wallet } from "lucide-react";
import { HealthRing } from "@/components/workspace/health-ring";
import { InsightFeed } from "@/components/workspace/insight-feed";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { RiskRadar } from "@/components/workspace/risk-radar";
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

export default function PortfolioHealthPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Portfolio Intelligence"
        title="Portfolio Health"
        description="Portfolio health, concentration risk, liquidity, diversification and recommendations."
        actions={
          <>
            <WorkspaceLink href="/ai-insights">AI Insights</WorkspaceLink>
            <WorkspaceLink href="/business-model">Business Model</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<HeartPulse />} label="Health Score" value={`${data.health.score}/100`} helper={data.health.rating} tone="green" />
        <PremiumStatCard icon={<Shield />} label="Risk Score" value={`${data.risk.riskScore}/100`} helper={data.risk.concentrationLevel} tone="amber" />
        <PremiumStatCard icon={<Wallet />} label="Cash" value={formatMoney(data.totalCashAud, 2)} helper={formatPercent(data.risk.cashPercent)} tone="blue" />
        <PremiumStatCard icon={<TrendingUp />} label="Return" value={formatMoney(data.totalReturnAud, 2)} helper={formatPercent(data.totalReturnPercent)} tone="purple" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
        <WorkspacePanel title="Health Ring">
          <HealthRing score={data.health.score} />
        </WorkspacePanel>

        <WorkspacePanel title="Risk Radar">
          <RiskRadar
            largestHoldingPercent={data.risk.largestHoldingPercent}
            largestSectorPercent={data.risk.largestSectorPercent}
            largestCountryPercent={data.risk.largestCountryPercent}
            highRiskPercent={data.risk.highRiskPercent}
            cashPercent={data.risk.cashPercent}
          />
        </WorkspacePanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Health Breakdown">
          <div className="space-y-4">
            <ProgressRow label="Diversification" value={`${data.health.score}/100`} percent={data.health.score} tone="emerald" />
            <ProgressRow label="Risk Control" value={`${100 - data.risk.riskScore}/100`} percent={100 - data.risk.riskScore} tone="sky" />
            <ProgressRow label="Liquidity" value={formatPercent(data.risk.cashPercent)} percent={data.risk.cashPercent} tone="violet" />
            <ProgressRow label="High Risk Exposure" value={formatPercent(data.risk.highRiskPercent)} percent={data.risk.highRiskPercent} tone="rose" />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Recommendations">
          <InsightFeed
            insights={data.recommendations.map((item) => ({
              id: item.id,
              title: item.title,
              detail: item.detail,
              category: item.category,
            }))}
          />
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
