import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ReportsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="PDF"
        title="Reports"
        description="Generate professional summary and detailed investor PDF reports."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Report module pending" description="PDF exports will connect after dashboard and engine data are live." />
      </div>
    </AppShell>
  );
}
