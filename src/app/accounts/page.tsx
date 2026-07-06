import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AccountsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Platforms"
        title="Accounts"
        description="Broker, cash, dividend and crypto account details."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Accounts module pending" description="Account balances will be generated from ledger and broker files." />
      </div>
    </AppShell>
  );
}
