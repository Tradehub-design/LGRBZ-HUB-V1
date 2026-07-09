"use client";

import { MonitorCog, Palette, PanelLeft, Settings2 } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useSettingsStore } from "@/store/settingsStore";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function SettingsPage() {
  useSeedPortfolio();
  const data = useDashboardData();
  const settings = useSettingsStore((state) => state.settings);
  const collapsed = useSettingsStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useSettingsStore((state) => state.toggleSidebar);

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="System"
        title="Settings"
        description="Application preferences, display settings and platform configuration."
        actions={<WorkspaceLink href="/dashboard">Dashboard</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<MonitorCog />} label="Currency" value={settings.displayCurrency} tone="blue" />
        <PremiumStatCard icon={<Palette />} label="Theme" value={settings.theme} tone="purple" />
        <PremiumStatCard icon={<Settings2 />} label="Density" value={settings.density} tone="green" />
        <PremiumStatCard icon={<PanelLeft />} label="Sidebar" value={collapsed ? "Collapsed" : "Expanded"} tone="amber" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Interface">
          <div className="space-y-3">
            <SettingRow label="Theme" value={settings.theme} />
            <SettingRow label="Display Currency" value={settings.displayCurrency} />
            <SettingRow label="Density" value={settings.density} />
            <SettingRow label="Animations" value={settings.enableAnimations ? "Enabled" : "Disabled"} />
            <SettingRow label="Offline Mode" value={settings.enableOfflineMode ? "Enabled" : "Disabled"} />
          </div>

          <button
            onClick={toggleSidebar}
            className="mt-5 rounded-lg bg-[#1f8cff] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(31,140,255,0.28)] transition hover:bg-sky-500"
          >
            Toggle Sidebar
          </button>
        </WorkspacePanel>


        <WorkspacePanel title="Data Status">
          <div className="space-y-3">
            <SettingRow label="Transactions" value={String(data.transactions.length)} />
            <SettingRow label="Open Holdings" value={String(data.openHoldings.length)} />
            <SettingRow label="Data Quality" value={`${data.dataQuality.score}/100 · ${data.dataQuality.rating}`} />
            <SettingRow label="Financial Years" value={String(data.financialYears.length)} />
          </div>
        </WorkspacePanel>


        <WorkspacePanel title="Roadmap Settings">
          <div className="space-y-3 text-sm text-slate-300">
            <Note tone="blue" text="User authentication will be added in v2.0." />
            <Note tone="green" text="Multi-portfolio support will be added after Supabase data model migration." />
            <Note tone="amber" text="Broker sync and live prices will become configurable from this workspace." />
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-sm last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <StatusPill tone="blue">{value}</StatusPill>
    </div>
  );
}

function Note({ text, tone }: { text: string; tone: "blue" | "green" | "amber" }) {
  return (
    <p className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <StatusPill tone={tone}>Roadmap</StatusPill>
      <span className="mt-2 block text-slate-400">{text}</span>
    </p>
  );
}
