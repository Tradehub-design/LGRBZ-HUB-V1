"use client";

import { UserRound } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function AccountPage() {
  const auth = useAuthSession();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Account"
        title="Account"
        description="User account and session status."
        actions={<WorkspaceLink href="/login">Login</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-3">
        <PremiumStatCard icon={<UserRound />} label="Signed In" value={auth.signedIn ? "Yes" : "No"} tone={auth.signedIn ? "green" : "amber"} />
        <PremiumStatCard label="Email" value={auth.userEmail ?? "Not signed in"} tone="blue" />
        <PremiumStatCard label="Loading" value={auth.loading ? "Yes" : "No"} tone="purple" />
      </WorkspaceGrid>

      <WorkspacePanel title="Session">
        <p className="text-sm text-slate-300">
          {auth.signedIn ? `Signed in as ${auth.userEmail}` : "No active session."}
        </p>
      </WorkspacePanel>
    </Workspace>
  );
}
