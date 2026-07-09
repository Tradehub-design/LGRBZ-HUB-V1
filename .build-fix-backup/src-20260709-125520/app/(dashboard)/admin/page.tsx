import { AdminActionsCard } from "@/features/admin/components/admin-actions-card";
import { AdminFooter } from "@/features/admin/components/admin-footer";
import { AdminHeader } from "@/features/admin/components/admin-header";
import { AdminSummaryCards } from "@/features/admin/components/admin-summary-cards";
import { BackupStatusCard } from "@/features/admin/components/backup-status-card";
import { DataQualityCard } from "@/features/admin/components/data-quality-card";
import { DataTablesCard } from "@/features/admin/components/data-tables-card";
import { SystemHealthCard } from "@/features/admin/components/system-health-card";
import { SystemMaintenanceCard } from "@/features/admin/components/system-maintenance-card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <AdminHeader />
      <AdminSummaryCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <SystemHealthCard />
        <DataQualityCard />
        <BackupStatusCard />
      </div>

      <AdminActionsCard />
      <SystemMaintenanceCard />
      <DataTablesCard />
      <AdminFooter />
    </div>
  );
}
