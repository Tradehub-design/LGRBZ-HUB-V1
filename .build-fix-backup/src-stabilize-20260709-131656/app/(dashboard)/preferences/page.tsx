"use client";

import { Settings2 } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { DEFAULT_USER_PREFERENCES } from "@/lib/user/preferences";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function PreferencesPage() {
  const preferences = DEFAULT_USER_PREFERENCES;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="System"
        title="Preferences"
        description="Personal workspace defaults and display preferences."
        actions={<WorkspaceLink href="/settings">Settings</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Settings2 />} label="Currency" value={preferences.defaultCurrency} tone="blue" />
        <PremiumStatCard label="Density" value={preferences.dashboardDensity} tone="purple" />
        <PremiumStatCard label="Start Page" value={preferences.defaultStartPage} tone="green" />
        <PremiumStatCard label="Demo Warnings" value={preferences.showDemoWarnings ? "On" : "Off"} tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="Preference Status">
        <p className="text-sm text-slate-400">
          Preferences are currently static. Supabase-backed saved preferences will be added in v2.0.
        </p>
      </WorkspacePanel>
    </Workspace>
  );
}
