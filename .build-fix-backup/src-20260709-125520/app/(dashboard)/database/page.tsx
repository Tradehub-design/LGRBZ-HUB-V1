"use client";

import { Database, Server, ShieldCheck } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { supabaseEnabled } from "@/lib/supabase/client";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function DatabasePage() {
  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="v2.0 Platform"
        title="Database"
        description="Supabase database persistence foundation."
        actions={<WorkspaceLink href="/auth">Authentication</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-3">
        <PremiumStatCard icon={<Database />} label="Database" value={supabaseEnabled ? "Connected" : "Demo Mode"} tone={supabaseEnabled ? "green" : "amber"} />
        <PremiumStatCard icon={<Server />} label="Tables" value="2" helper="Starter schema" tone="blue" />
        <PremiumStatCard icon={<ShieldCheck />} label="RLS" value="Pending" helper="Next bundle" tone="purple" />
      </WorkspaceGrid>

      <WorkspacePanel title="Persistence Status">
        <p className="text-sm text-slate-300">
          Database repositories are now available for portfolios and portfolio transactions.
        </p>
      </WorkspacePanel>
    </Workspace>
  );
}
