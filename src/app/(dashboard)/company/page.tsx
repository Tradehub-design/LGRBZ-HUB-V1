"use client";

import { Building2, LineChart, Shield, TrendingUp } from "lucide-react";
import { PriceChart } from "@/components/market/price-chart";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { demoMetrics } from "@/lib/market/companyMetrics";
import { getCompanyProfile } from "@/lib/market/companyProfile";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function CompanyWorkspace() {
  const profile = getCompanyProfile("VAS");

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Research"
        title="Company Research"
        description="Company overview, profile, valuation snapshot and interactive market chart."
        actions={
          <>
            <WorkspaceLink href="/market-watchlist">Watchlist</WorkspaceLink>
            <WorkspaceLink href="/research-lab">Research Lab</WorkspaceLink>
          </>
        }
      />

      <WorkspacePanel title="Company Profile">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{profile.symbol} · {profile.name}</h2>
                <p className="text-sm text-slate-500">{profile.exchange} · {profile.sector} · {profile.industry}</p>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              {profile.description}
            </p>
          </div>

          <StatusPill tone="blue">Demo Profile</StatusPill>
        </div>
      </WorkspacePanel>

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<LineChart />} label="Market Cap" value={demoMetrics.marketCap} tone="blue" />
        <PremiumStatCard icon={<TrendingUp />} label="P/E" value={String(demoMetrics.pe)} helper={`EPS ${demoMetrics.eps}`} tone="green" />
        <PremiumStatCard icon={<Shield />} label="ROE" value={demoMetrics.roe} tone="purple" />
        <PremiumStatCard label="Dividend Yield" value={demoMetrics.dividendYield} tone="amber" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <WorkspacePanel title="Price History">
          <PriceChart />
        </WorkspacePanel>

        <WorkspacePanel title="Key Metrics">
          <div className="space-y-3">
            <Metric label="Beta" value={String(demoMetrics.beta)} />
            <Metric label="52 Week High" value={`$${demoMetrics.week52High}`} />
            <Metric label="52 Week Low" value={`$${demoMetrics.week52Low}`} />
            <Metric label="Dividend Yield" value={demoMetrics.dividendYield} />
            <Metric label="Market Cap" value={demoMetrics.marketCap} />
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-sm last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
