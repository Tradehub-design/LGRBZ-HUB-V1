import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ImportPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Data"
        title="Import Centre"
        description="Upload transactions, current holdings, cash balances, dividend history, tax reports and broker exports."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Import module pending" description="CSV and TSV import tools will be connected to the engine." />
      </div>
    </AppShell>
  );
}
