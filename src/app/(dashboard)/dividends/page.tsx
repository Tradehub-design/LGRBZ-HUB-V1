import { DividendCalendarCard } from "@/features/dividends/components/dividend-calendar-card";
import { DividendFooterSummary } from "@/features/dividends/components/dividend-footer-summary";
import { DividendSummaryCards } from "@/features/dividends/components/dividend-summary-cards";
import { DividendTable } from "@/features/dividends/components/dividend-table";
import { DividendYieldCard } from "@/features/dividends/components/dividend-yield-card";
import { DividendsHeader } from "@/features/dividends/components/dividends-header";

export default function DividendsPage() {
  return (
    <div className="space-y-6">
      <DividendsHeader />

      <DividendSummaryCards />

      <div className="grid gap-6 xl:grid-cols-2">
        <DividendCalendarCard />
        <DividendYieldCard />
      </div>

      <DividendTable />

      <DividendFooterSummary />
    </div>
  );
}
