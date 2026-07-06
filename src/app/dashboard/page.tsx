import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";

import {
  AllocationList,
  DashboardMetricGrid,
  DividendCard,
  RecentTransactionsCard,
  TopHoldingsCard,
  useDashboardData,
} from "@/features/dashboard";

function DashboardContent() {
  const { allocation } = useDashboardData();

  return (
    <div className="space-y-6">

      <PageHeader
        eyebrow="Portfolio Overview"
        title="Dashboard"
        description="Real-time portfolio summary generated from your master transaction ledger."
        actions={<PageActionsMenu />}
      />

      <DashboardMetricGrid />

      <div className="grid gap-6 xl:grid-cols-2">
        <AllocationList
          title="Sector Allocation"
          description="Current portfolio exposure."
          data={allocation.sector}
        />

        <AllocationList
          title="Asset Allocation"
          description="Stocks, ETFs, Crypto and Cash."
          data={allocation.assetClass}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TopHoldingsCard />
        <RecentTransactionsCard />
      </div>

      <DividendCard />

    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
