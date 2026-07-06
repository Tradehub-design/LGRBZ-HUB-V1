import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DividendsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Income"
        title="Dividends"
        description="Dividend history, yield, income forecast and dividend calendar in one page."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Dividend module pending" description="Dividend rows will be extracted from the master ledger." />
      </div>
    </AppShell>
  );
}
