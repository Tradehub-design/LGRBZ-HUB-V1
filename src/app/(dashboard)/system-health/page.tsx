"use client";

import { Activity, Database, ShieldCheck, Wifi } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function SystemHealthPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Production"
        title="System Health"
        description="Application status, data quality, build readiness and production checks."
        actions={<WorkspaceLink href="/settings">Settings</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Activity />} label="App Status" value="Online" tone="green" />
        <PremiumStatCard icon={<Database />} label="Ledger Rows" value={String(data.transactions.length)} tone="blue" />
        <PremiumStatCard icon={<ShieldCheck />} label="Data Quality" value={`${data.dataQuality.score}/100`} helper={data.dataQuality.rating} tone="purple" />
        <PremiumStatCard icon={<Wifi />} label="Market Provider" value="Demo" helper="Live API later" tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="System Checks">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Portfolio engine", "Ready"],
            ["Seeded CSV data", "Ready"],
            ["Market provider", "Demo mode"],
            ["Tax engine", "Review required"],
            ["Authentication", "Planned"],
            ["Broker sync", "Planned"],
          ].map(([label, status]) => (
            <div key={label} className="flex items-center justify-between rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              <span className="text-sm text-slate-300">{label}</span>
              <span className="text-sm font-semibold text-white">{status}</span>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
