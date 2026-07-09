import { FeesSummaryCard } from "@/features/transactions/components/fees-summary-card";
import { RecentDividendsCard } from "@/features/transactions/components/recent-dividends-card";
import { TransactionTypeCard } from "@/features/transactions/components/transaction-type-card";
import { TransactionsFooterSummary } from "@/features/transactions/components/transactions-footer-summary";

export function TransactionsFeaturePage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <TransactionTypeCard />
        <RecentDividendsCard />
        <FeesSummaryCard />
      </div>

      <TransactionsFooterSummary />
    </div>
  );
}
