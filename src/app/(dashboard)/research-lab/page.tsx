"use client";

import { Search, Sparkles } from "lucide-react";
import { AssetLogo } from "@/components/workspace/asset-logo";
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

export default function ResearchLabPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Research Workspace"
        title="Research Lab"
        description="Research ideas, watchlist signals and AI-style investment prompts."
        actions={
          <>
            <WorkspaceLink href="/watchlist">Watchlist</WorkspaceLink>
            <WorkspaceLink href="/ai-insights">AI Insights</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Search />} label="Ideas" value={String(data.watchlistIdeas.length)} tone="blue" />
        <PremiumStatCard icon={<Sparkles />} label="Insights" value={String(data.intelligenceInsights.length)} tone="purple" />
        <PremiumStatCard label="Held Positions" value={String(data.openHoldings.length)} tone="green" />
        <PremiumStatCard label="Mode" value="Research" helper="Live data later" tone="amber" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <WorkspacePanel title="Research Ideas">
          <div className="space-y-3">
            {data.watchlistIdeas.map((idea) => (
              <div key={idea.symbol} className="rounded-xl border border-[#173047] bg-[#0b1e30] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AssetLogo symbol={idea.symbol} />
                    <div>
                      <p className="font-semibold text-white">{idea.symbol}</p>
                      <p className="text-xs text-slate-500">{idea.name}</p>
                    </div>
                  </div>
                  <StatusPill tone={idea.priority === "High" ? "rose" : idea.priority === "Medium" ? "amber" : "blue"}>
                    {idea.priority}
                  </StatusPill>
                </div>
                <p className="mt-3 text-sm text-slate-400">{idea.reason}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Research Prompts">
          <div className="space-y-3">
            {[
              "Which holding is driving most of my risk?",
              "What ETF would improve diversification?",
              "How can I increase dividend income?",
              "Which sector am I overweight?",
              "What happens if I reduce my largest holding?"
            ].map((prompt) => (
              <div key={prompt} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3 text-sm text-slate-300">
                {prompt}
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
