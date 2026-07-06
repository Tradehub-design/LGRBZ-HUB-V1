import { AccountPerformanceTable } from "@/features/analytics/components/account-performance-table";
import { AnalyticsHeader } from "@/features/analytics/components/analytics-header";
import { AnalyticsRangeSelector } from "@/features/analytics/components/analytics-range-selector";
import { AnalyticsSummaryCards } from "@/features/analytics/components/analytics-summary-cards";
import { PerformanceCurveCard } from "@/features/analytics/components/performance-curve-card";
import { SectorPerformanceTable } from "@/features/analytics/components/sector-performance-table";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <AnalyticsHeader />
        <AnalyticsRangeSelector />
      </div>

      <AnalyticsSummaryCards />
      <PerformanceCurveCard />

      <div className="grid gap-6 xl:grid-cols-2">
        <AccountPerformanceTable />
        <SectorPerformanceTable />
      </div>
    </div>
  );
}
