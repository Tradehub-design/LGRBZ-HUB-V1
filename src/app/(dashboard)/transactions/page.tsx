import { AuditTrailCard } from "@/features/transactions/components/audit-trail-card";
import { BrokerReconciliationCard } from "@/features/transactions/components/broker-reconciliation-card";
import { DividendHistoryTable } from "@/features/transactions/components/dividend-history-table";
import { FeesSummaryCard } from "@/features/transactions/components/fees-summary-card";
import { ImportHistoryCard } from "@/features/transactions/components/import-history-card";
import { RecentDividendsCard } from "@/features/transactions/components/recent-dividends-card";
import { TransactionEditorCard } from "@/features/transactions/components/transaction-editor-card";
import { TransactionSummaryCards } from "@/features/transactions/components/transaction-summary-cards";
import { TransactionTypeCard } from "@/features/transactions/components/transaction-type-card";
import { TransactionsFilterBar } from "@/features/transactions/components/transactions-filter-bar";
import { TransactionsFooterSummary } from "@/features/transactions/components/transactions-footer-summary";
import { TransactionsHeader } from "@/features/transactions/components/transactions-header";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <TransactionsHeader />
      <TransactionsFilterBar />
      <TransactionSummaryCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <TransactionTypeCard />
        <RecentDividendsCard />
        <FeesSummaryCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TransactionEditorCard />
        <ImportHistoryCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BrokerReconciliationCard />
        <AuditTrailCard />
      </div>

      <DividendHistoryTable />
      <TransactionsTable />
      <TransactionsFooterSummary />
    </div>
  );
}
