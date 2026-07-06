import { AccountActionsCard } from "@/features/accounts/components/account-actions-card";
import { AccountAllocationCard } from "@/features/accounts/components/account-allocation-card";
import { AccountCashCard } from "@/features/accounts/components/account-cash-card";
import { AccountCashFlowCard } from "@/features/accounts/components/account-cash-flow-card";
import { AccountPerformanceCard } from "@/features/accounts/components/account-performance-card";
import { AccountReconciliationCard } from "@/features/accounts/components/account-reconciliation-card";
import { AccountSettingsCard } from "@/features/accounts/components/account-settings-card";
import { AccountSummaryCards } from "@/features/accounts/components/account-summary-cards";
import { AccountsFooterSummary } from "@/features/accounts/components/accounts-footer-summary";
import { AccountsHeader } from "@/features/accounts/components/accounts-header";
import { AccountsTable } from "@/features/accounts/components/accounts-table";
import { BrokerAnalysisCard } from "@/features/accounts/components/broker-analysis-card";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <AccountsHeader />
      <AccountSummaryCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <AccountPerformanceCard />
        <AccountAllocationCard />
        <AccountCashCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BrokerAnalysisCard />
        <AccountCashFlowCard />
        <AccountSettingsCard />
        <AccountReconciliationCard />
        <AccountActionsCard />
      </div>

      <AccountsTable />
      <AccountsFooterSummary />
    </div>
  );
}
