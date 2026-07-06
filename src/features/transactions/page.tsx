...
import { FeesSummaryCard } from "@/features/transactions/components/fees-summary-card";
import { TransactionsFooterSummary } from "@/features/transactions/components/transactions-footer-summary";

...

<div className="grid gap-6 xl:grid-cols-3">
    <TransactionTypeCard />
    <RecentDividendsCard />
    <FeesSummaryCard />
</div>

<TransactionsTable />

<TransactionsFooterSummary />
