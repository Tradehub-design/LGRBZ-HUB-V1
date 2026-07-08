"use client";

import { ClipboardCheck } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { PRODUCTION_CHECKLIST } from "@/lib/system/productionChecklist";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function ProductionChecklistPage() {
  const complete = PRODUCTION_CHECKLIST.filter((item) => item.status === "complete").length;
  const partial = PRODUCTION_CHECKLIST.filter((item) => item.status === "partial").length;
  const planned = PRODUCTION_CHECKLIST.filter((item) => item.status === "planned").length;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Production"
        title="Production Checklist"
        description="Readiness checklist before moving into v2.0 live platform work."
        actions={<WorkspaceLink href="/system-health">System Health</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<ClipboardCheck />} label="Checklist Items" value={String(PRODUCTION_CHECKLIST.length)} tone="blue" />
        <PremiumStatCard label="Complete" value={String(complete)} tone="green" />
        <PremiumStatCard label="Partial" value={String(partial)} tone="amber" />
        <PremiumStatCard label="Planned" value={String(planned)} tone="purple" />
      </WorkspaceGrid>

      <WorkspacePanel title="Readiness Items">
        <div className="space-y-3">
          {PRODUCTION_CHECKLIST.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              <div>
                <p className="font-semibold text-white">{item.label}</p>
                <p className="text-xs text-slate-500">{item.area}</p>
              </div>
              <StatusPill tone={item.status === "complete" ? "green" : item.status === "partial" ? "amber" : "blue"}>
                {item.status}
              </StatusPill>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
