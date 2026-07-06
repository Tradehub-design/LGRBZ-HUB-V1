import { BrokerHealthCard } from "@/features/broker-sync/components/broker-health-card";
import { BrokerSyncFooter } from "@/features/broker-sync/components/broker-sync-footer";
import { BrokerSyncHeader } from "@/features/broker-sync/components/broker-sync-header";
import { BrokerSyncSummary } from "@/features/broker-sync/components/broker-sync-summary";
import { BrokerSyncTable } from "@/features/broker-sync/components/broker-sync-table";
import { ImportQueueCard } from "@/features/broker-sync/components/import-queue-card";
import { SyncActionsCard } from "@/features/broker-sync/components/sync-actions-card";
import { SyncErrorsCard } from "@/features/broker-sync/components/sync-errors-card";
import { SyncHistoryCard } from "@/features/broker-sync/components/sync-history-card";

export default function BrokerSyncPage() {
  return (
    <div className="space-y-6">
      <BrokerSyncHeader />
      <BrokerSyncSummary />

      <div className="grid gap-6 xl:grid-cols-2">
        <BrokerHealthCard />
        <SyncHistoryCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ImportQueueCard />
        <SyncErrorsCard />
      </div>

      <BrokerSyncTable />
      <SyncActionsCard />
      <BrokerSyncFooter />
    </div>
  );
}
