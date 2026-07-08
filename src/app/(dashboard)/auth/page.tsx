"use client";

import { Lock, ShieldCheck, UserRound } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { getAuthStatus } from "@/lib/supabase/authStatus";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function AuthPage() {
  const status = getAuthStatus();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="v2.0 Platform"
        title="Authentication"
        description="Supabase authentication foundation for private user portfolios."
        actions={<WorkspaceLink href="/production-checklist">Checklist</WorkspaceLink>
        <WorkspaceLink href="/login">Login</WorkspaceLink>
        <WorkspaceLink href="/account">Account</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-3">
        <PremiumStatCard icon={<Lock />} label="Auth Mode" value={status.mode} tone={status.enabled ? "green" : "amber"} />
        <PremiumStatCard icon={<UserRound />} label="User Accounts" value={status.enabled ? "Ready" : "Pending"} tone="blue" />
        <PremiumStatCard icon={<ShieldCheck />} label="Security" value="Foundation" tone="purple" />
      </WorkspaceGrid>

      <WorkspacePanel title="Setup Status">
        <p className="text-sm text-slate-300">{status.message}</p>
      </WorkspacePanel>
    </Workspace>
  );
}
