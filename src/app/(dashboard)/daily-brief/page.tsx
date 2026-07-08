"use client";

import { Newspaper, Sparkles } from "lucide-react";
import { InsightFeed } from "@/components/workspace/insight-feed";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
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

export default function DailyBriefPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const brief = [
    {
      id: "value",
      title: "Portfolio value",
      detail: `Current portfolio value is ${formatMoney(data.totalValueAud, 2)} with total return of ${formatMoney(data.totalReturnAud, 2)}.`,
      category: "Portfolio",
    },
    {
      id: "health",
      title: "Health status",
      detail: `Health score is ${data.health.score}/100 and rated ${data.health.rating}.`,
      category: "Health",
    },
    {
      id: "risk",
      title: "Risk status",
      detail: `Risk score is ${data.risk.riskScore}/100. Largest holding is ${formatPercent(data.risk.largestHoldingPercent)}.`,
      category: "Risk",
    },
    {
      id: "income",
      title: "Income status",
      detail: `Annualised dividend income is ${formatMoney(data.incomeMetrics.annualisedIncomeAud, 2)}.`,
      category: "Income",
    },
  ];

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="AI Brief"
        title="Daily Brief"
        description="A portfolio briefing generated from your live engine data."
        actions={
          <>
            <WorkspaceLink href="/dashboard">Dashboard</WorkspaceLink>
            <WorkspaceLink href="/ai-insights">AI Insights</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Newspaper />} label="Brief Items" value={String(brief.length)} tone="blue" />
        <PremiumStatCard icon={<Sparkles />} label="Insights" value={String(data.intelligenceInsights.length)} tone="purple" />
        <PremiumStatCard label="Health" value={`${data.health.score}/100`} tone="green" />
        <PremiumStatCard label="Risk" value={`${data.risk.riskScore}/100`} tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="Today's Portfolio Brief">
        <InsightFeed insights={brief} />
      </WorkspacePanel>

      <WorkspacePanel title="Priority Intelligence">
        <InsightFeed
          insights={data.intelligenceInsights.map((item) => ({
            id: item.id,
            title: item.title,
            detail: item.detail,
            category: item.category,
          }))}
        />
      </WorkspacePanel>
    </Workspace>
  );
}
