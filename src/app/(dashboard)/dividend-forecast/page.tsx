import { DividendForecastActionsCard } from "@/features/dividend-forecast/components/dividend-forecast-actions-card";
import { DividendForecastFooter } from "@/features/dividend-forecast/components/dividend-forecast-footer";
import { DividendForecastHeader } from "@/features/dividend-forecast/components/dividend-forecast-header";
import { DividendForecastSummary } from "@/features/dividend-forecast/components/dividend-forecast-summary";
import { DividendForecastTable } from "@/features/dividend-forecast/components/dividend-forecast-table";
import { IncomeGrowthCard } from "@/features/dividend-forecast/components/income-growth-card";
import { MonthlyIncomeCard } from "@/features/dividend-forecast/components/monthly-income-card";
import { UpcomingPaymentsCard } from "@/features/dividend-forecast/components/upcoming-payments-card";
import { YieldOnCostCard } from "@/features/dividend-forecast/components/yield-on-cost-card";

export default function DividendForecastPage() {
  return (
    <div className="space-y-6">
      <DividendForecastHeader />
      <DividendForecastSummary />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <DividendForecastTable />
        <UpcomingPaymentsCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <MonthlyIncomeCard />
        <IncomeGrowthCard />
        <YieldOnCostCard />
      </div>

      <DividendForecastActionsCard />
      <DividendForecastFooter />
    </div>
  );
}
