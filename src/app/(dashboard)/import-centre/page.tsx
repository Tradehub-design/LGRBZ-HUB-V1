"use client";

import { FileSpreadsheet, UploadCloud, WandSparkles } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { BROKER_SOURCES } from "@/lib/portfolio-engine/brokerImport";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function ImportCentrePage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Data Engine"
        title="Import Centre"
        description="CSV import hub for transactions, broker exports and future automated sync."
        actions={
          <>
            <WorkspaceLink href="/transactions">Transactions</WorkspaceLink>
            <WorkspaceLink href="/broker-sync">Broker Sync</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<FileSpreadsheet />} label="Ledger Rows" value={String(data.transactions.length)} tone="blue" />
        <PremiumStatCard icon={<UploadCloud />} label="Broker Sources" value={String(BROKER_SOURCES.length)} tone="purple" />
        <PremiumStatCard icon={<WandSparkles />} label="Automation" value="Planned" helper="v2.0" tone="amber" />
        <PremiumStatCard label="Data Quality" value={`${data.dataQuality.score}/100`} helper={data.dataQuality.rating} tone="green" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <WorkspacePanel title="Import Methods">
          <div className="space-y-3">
            {[
              ["Seeded CSV Ledger", "Active", "Current source of truth for portfolio data."],
              ["Broker CSV Upload", "Ready", "Broker-specific CSV mapping foundation."],
              ["API Broker Sync", "Planned", "Future live broker connection."],
              ["Price Feed Sync", "Planned", "Future live market valuation."],
            ].map(([title, status, detail]) => (
              <div key={title} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{title}</p>
                  <StatusPill tone={status === "Active" ? "green" : status === "Ready" ? "blue" : "amber"}>
                    {status}
                  </StatusPill>
                </div>
                <p className="mt-2 text-sm text-slate-400">{detail}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Data Quality">
          <div className="space-y-3">
            {data.dataQuality.warnings.map((warning) => (
              <p key={warning} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3 text-sm text-slate-300">
                {warning}
              </p>
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
