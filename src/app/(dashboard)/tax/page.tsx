import { CapitalGainsCard } from "@/features/tax/components/capital-gains-card";
import { DividendTaxCard } from "@/features/tax/components/dividend-tax-card";
import { TaxActionsCard } from "@/features/tax/components/tax-actions-card";
import { TaxEventsTable } from "@/features/tax/components/tax-events-table";
import { TaxFooterSummary } from "@/features/tax/components/tax-footer-summary";
import { TaxHeader } from "@/features/tax/components/tax-header";
import { TaxNotesCard } from "@/features/tax/components/tax-notes-card";
import { TaxReconciliationCard } from "@/features/tax/components/tax-reconciliation-card";
import { TaxSummaryCards } from "@/features/tax/components/tax-summary-cards";
import { TaxYearCard } from "@/features/tax/components/tax-year-card";

export default function TaxPage() {
  return (
    <div className="space-y-6">
      <TaxHeader />
      <TaxSummaryCards />

      <div className="grid gap-6 xl:grid-cols-2">
        <CapitalGainsCard />
        <DividendTaxCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <TaxYearCard />
        <TaxReconciliationCard />
        <TaxNotesCard />
      </div>

      <TaxActionsCard />
      <TaxEventsTable />
      <TaxFooterSummary />
    </div>
  );
}
