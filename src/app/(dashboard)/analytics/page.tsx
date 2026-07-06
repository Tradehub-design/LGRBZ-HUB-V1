import { AnalyticsFooterSummary } from "@/features/analytics/components/analytics-footer-summary";
import { BenchmarkComparisonCard } from "@/features/analytics/components/benchmark-comparison-card";
import { DividendAnalyticsCard } from "@/features/analytics/components/dividend-analytics-card";
import { DrawdownAnalysisCard } from "@/features/analytics/components/drawdown-analysis-card";
import { ExportReportCard } from "@/features/analytics/components/export-report-card";
import { MonthlyReturnTable } from "@/features/analytics/components/monthly-return-table";
import { RealisedVsUnrealisedCard } from "@/features/analytics/components/realised-vs-unrealised-card";
import { TopPerformersCard } from "@/features/analytics/components/top-performers-card";

<div className="grid gap-6 xl:grid-cols-2">
  <DividendAnalyticsCard />
  <RealisedVsUnrealisedCard />
</div>

<div className="grid gap-6 xl:grid-cols-2">
  <BenchmarkComparisonCard />
  <DrawdownAnalysisCard />
</div>

<div className="grid gap-6 xl:grid-cols-2">
  <MonthlyReturnTable />
  <TopPerformersCard />
</div>

<ExportReportCard />

<AnalyticsFooterSummary />
