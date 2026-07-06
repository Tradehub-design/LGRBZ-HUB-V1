import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function TransactionsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Master ledger"
        title="Transactions"
        description="The single source of truth for deposits, withdrawals, buys, sells, dividends, interest, fees and crypto."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState
          title="Transaction table coming next"
          description="The next engine will parse the master ledger and display all transaction rows."
        />
      </div>
    </AppShell>
  );
}
