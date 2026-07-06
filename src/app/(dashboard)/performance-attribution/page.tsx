import { AttributionActionsCard } from "@/features/performance-attribution/components/attribution-actions-card";
import { AttributionFooterSummary } from "@/features/performance-attribution/components/attribution-footer-summary";
import { AttributionHeader } from "@/features/performance-attribution/components/attribution-header";
import { AttributionInsightsCard } from "@/features/performance-attribution/components/attribution-insights-card";
import { AttributionPeriodSelector } from "@/features/performance-attribution/components/attribution-period-selector";
import { AttributionSummaryCards } from "@/features/performance-attribution/components/attribution-summary-cards";
import { AttributionTable } from "@/features/performance-attribution/components/attribution-table";
import { CategoryAttributionCard } from "@/features/performance-attribution/components/category-attribution-card";
import { NegativeContributorsCard } from "@/features/performance-attribution/components/negative-contributors-card";
import { TopContributorsCard } from "@/features/performance-attribution/components/top-contributors-card";

export default function PerformanceAttributionPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <AttributionHeader />
        <AttributionPeriodSelector />
      </div>

      <AttributionSummaryCards />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <AttributionTable />
        <CategoryAttributionCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <TopContributorsCard />
        <NegativeContributorsCard />
        <AttributionInsightsCard />
      </div>

      <AttributionActionsCard />
      <AttributionFooterSummary />
    </div>
  );
}
