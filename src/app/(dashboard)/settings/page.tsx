"use client";

import { useSettingsStore } from "@/store/settingsStore";
import {
  MetricTile,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function SettingsPage() {
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
        <MetricTile label="Currency" value={settings.displayCurrency} />
        <MetricTile label="Theme" value={settings.theme} />
        <MetricTile label="Density" value={settings.density} />
        <MetricTile label="Sidebar" value={collapsed ? "Collapsed" : "Expanded"} />
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
            className="mt-5 rounded-lg bg-[#1f8cff] px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
          >
            Toggle Sidebar
          </button>
        </WorkspacePanel>

        <WorkspacePanel title="Roadmap Settings">
          <div className="space-y-3 text-sm text-slate-300">
            <Note text="User authentication will be added in v2.0." />
            <Note text="Multi-portfolio support will be added after Supabase data model migration." />
            <Note text="Broker sync and live prices will become configurable from this workspace." />
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
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function Note({ text }: { text: string }) {
  return <p className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">{text}</p>;
}
