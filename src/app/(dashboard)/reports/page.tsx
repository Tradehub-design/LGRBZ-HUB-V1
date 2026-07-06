import { ReportActionsCard } from "@/features/reports/components/report-actions-card";
import { ReportGeneratorCard } from "@/features/reports/components/report-generator-card";
import { ReportNotesCard } from "@/features/reports/components/report-notes-card";
import { ReportTemplatesCard } from "@/features/reports/components/report-templates-card";
import { ReportsFooter } from "@/features/reports/components/reports-footer";
import { ReportsHeader } from "@/features/reports/components/reports-header";
import { ReportsHistoryTable } from "@/features/reports/components/reports-history-table";
import { ReportsSummaryCards } from "@/features/reports/components/reports-summary-cards";
import { ScheduledReportsCard } from "@/features/reports/components/scheduled-reports-card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <ReportsHeader />
      <ReportsSummaryCards />
      <ReportGeneratorCard />

      <div className="grid gap-6 xl:grid-cols-3">
        <ScheduledReportsCard />
        <ReportTemplatesCard />
        <ReportNotesCard />
      </div>

      <ReportActionsCard />
      <ReportsHistoryTable />
      <ReportsFooter />
    </div>
  );
}
