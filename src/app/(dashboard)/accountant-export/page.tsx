"use client";

import { Download, FileText, PackageCheck } from "lucide-react";
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

export default function AccountantExportPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Tax Centre"
        title="Accountant Export"
        description="Accountant-ready tax package summary. File export will be added later."
        actions={<WorkspaceLink href="/tax-report">Tax Report</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-3">
        <PremiumStatCard icon={<PackageCheck />} label="Export Status" value={data.taxExportSummary.ready ? "Ready" : "Draft"} tone="green" />
        <PremiumStatCard icon={<FileText />} label="Sections" value={String(data.taxExportSummary.sections.length)} tone="blue" />
        <PremiumStatCard icon={<Download />} label="Output" value="Pending" helper="PDF/CSV later" tone="amber" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Included Sections">
          <div className="space-y-3">
            {data.taxExportSummary.sections.map((section) => (
              <div key={section} className="flex items-center justify-between rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
                <span className="text-sm font-semibold text-white">{section}</span>
                <StatusPill tone="green">Included</StatusPill>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Export Notes">
          <div className="space-y-3">
            {data.taxExportSummary.notes.map((note) => (
              <p key={note} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3 text-sm text-slate-300">
                {note}
              </p>
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
