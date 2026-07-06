import { AlertPreferencesCard } from "@/features/settings/components/alert-preferences-card";
import { DataPreferencesCard } from "@/features/settings/components/data-preferences-card";
import { PreferenceSelectCard } from "@/features/settings/components/preference-select-card";
import { ReportPreferencesCard } from "@/features/settings/components/report-preferences-card";
import { SettingsActionsCard } from "@/features/settings/components/settings-actions-card";
import { SettingsFooterSummary } from "@/features/settings/components/settings-footer-summary";
import { SettingsHeader } from "@/features/settings/components/settings-header";
import { SettingsSummaryCard } from "@/features/settings/components/settings-summary-card";
import { SettingsToggleCard } from "@/features/settings/components/settings-toggle-card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsHeader />
      <SettingsSummaryCard />
      <PreferenceSelectCard />
      <SettingsToggleCard />

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportPreferencesCard />
        <AlertPreferencesCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DataPreferencesCard />
        <SettingsActionsCard />
      </div>

      <SettingsFooterSummary />
    </div>
  );
}
