"use client";

import { Database, FolderKanban } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { useDbPortfolios } from "@/hooks/useDbPortfolios";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function DbPortfoliosPage() {
  const data = useDbPortfolios();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="v2.0 Platform"
        title="Database Portfolios"
        description="Supabase-backed portfolio loading foundation."
        actions={<WorkspaceLink href="/database">Database</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-3">
        <PremiumStatCard icon={<FolderKanban />} label="Portfolios" value={String(data.portfolios.length)} tone="blue" />
        <PremiumStatCard icon={<Database />} label="Loading" value={data.loading ? "Yes" : "No"} tone="purple" />
        <PremiumStatCard label="Status" value={data.error ? "Error" : "Ready"} helper={data.error ?? "No error"} tone={data.error ? "rose" : "green"} />
      </WorkspaceGrid>

      <WorkspacePanel title="Portfolios">
        <div className="space-y-3">
          {data.portfolios.map((portfolio) => (
            <div key={portfolio.id} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{portfolio.name}</p>
                <StatusPill tone="blue">{portfolio.currency}</StatusPill>
              </div>
              <p className="mt-2 text-xs text-slate-500">{portfolio.created_at}</p>
            </div>
          ))}

          {!data.loading && data.portfolios.length === 0 ? (
            <p className="rounded-lg border border-[#173047] bg-[#0b1e30] p-4 text-sm text-slate-400">
              No database portfolios found yet.
            </p>
          ) : null}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
