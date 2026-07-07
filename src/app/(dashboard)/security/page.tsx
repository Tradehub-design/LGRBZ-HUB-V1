import { AuditLogTable } from "@/features/security/components/audit-log-table";
import { ConnectedDevicesCard } from "@/features/security/components/connected-devices-card";
import { LoginHistoryCard } from "@/features/security/components/login-history-card";
import { SecurityActionsCard } from "@/features/security/components/security-actions-card";
import { SecurityFooter } from "@/features/security/components/security-footer";
import { SecurityHeader } from "@/features/security/components/security-header";
import { SecurityScoreCard } from "@/features/security/components/security-score-card";
import { SecuritySettingsCard } from "@/features/security/components/security-settings-card";
import { SecuritySummaryCards } from "@/features/security/components/security-summary-cards";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <SecurityHeader />

      <SecuritySummaryCards />

      <div className="grid gap-6 xl:grid-cols-[350px_1fr]">
        <SecurityScoreCard />
        <SecuritySettingsCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LoginHistoryCard />
        <ConnectedDevicesCard />
      </div>

      <SecurityActionsCard />

      <AuditLogTable />

      <SecurityFooter />
    </div>
  );
}