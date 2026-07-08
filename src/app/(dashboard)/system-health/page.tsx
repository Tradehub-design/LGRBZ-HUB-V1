"use client";

import { Activity, Database, ShieldCheck, Wifi } from "lucide-react";
import { DemoDataBanner } from "@/components/system/demo-data-banner";
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

      <DemoDataBanner />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Activity />} label="App Status" value="Online" tone="green" />
        <PremiumStatCard icon={<Database />} label="Ledger Rows" value={String(data.transactions.length)} tone="blue" />
        <PremiumStatCard icon={<ShieldCheck />} label="Data Quality" value={`${data.dataQuality.score}/100`} helper={data.dataQuality.rating} tone="purple" />
        <PremiumStatCard icon={<Wifi />} label="Market Provider" value="Demo" helper="Live API later" tone="amber" />
      </WorkspaceGrid>


      <WorkspacePanel title="Validation Checks">
        <div className="space-y-3">
          {data.validation.checks.map((check) => (
            <div key={check.id} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{check.label}</p>
                <span className={check.status === "pass" ? "text-emerald-300" : check.status === "warning" ? "text-amber-300" : "text-rose-300"}>
                  {check.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{check.detail}</p>
            </div>
          ))}
        </div>
      </WorkspacePanel>


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
