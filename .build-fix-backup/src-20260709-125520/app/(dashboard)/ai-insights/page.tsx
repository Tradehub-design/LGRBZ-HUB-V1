"use client";

import { Sparkles } from "lucide-react";
import { InsightFeed } from "@/components/workspace/insight-feed";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function AiInsightsPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const highPriority = data.intelligenceInsights.filter((item) => item.priority === "High").length;
  const mediumPriority = data.intelligenceInsights.filter((item) => item.priority === "Medium").length;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="AI Workspace"
        title="AI Insights"
        description="Rule-based portfolio intelligence. Live AI assistant will connect later."
        actions={
          <>
            <WorkspaceLink href="/dashboard">Dashboard</WorkspaceLink>
            <WorkspaceLink href="/portfolio-health">Health</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Sparkles />} label="Insights" value={String(data.intelligenceInsights.length)} tone="blue" />
        <PremiumStatCard label="High Priority" value={String(highPriority)} tone="rose" />
        <PremiumStatCard label="Medium Priority" value={String(mediumPriority)} tone="amber" />
        <PremiumStatCard label="Mode" value="Rules" helper="LLM later" tone="purple" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <WorkspacePanel title="Portfolio Intelligence">
          <InsightFeed
            insights={data.intelligenceInsights.map((item) => ({
              id: item.id,
              title: item.title,
              detail: item.detail,
              category: item.category,
            }))}
          />
        </WorkspacePanel>

        <WorkspacePanel title="Insight Register">
          <div className="space-y-3">
            {data.intelligenceInsights.map((item) => (
              <div key={item.id} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
                <div className="flex items-center justify-between">
                  <StatusPill tone={item.priority === "High" ? "rose" : item.priority === "Medium" ? "amber" : "blue"}>
                    {item.priority}
                  </StatusPill>
                  <span className="text-xs text-slate-500">{item.category}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
