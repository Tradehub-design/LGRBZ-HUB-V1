import { BenchmarkComparisonCard } from "@/features/analytics/components/benchmark-comparison-card";
import { DividendAnalyticsCard } from "@/features/analytics/components/dividend-analytics-card";
import { DrawdownAnalysisCard } from "@/features/analytics/components/drawdown-analysis-card";
import { RealisedVsUnrealisedCard } from "@/features/analytics/components/realised-vs-unrealised-card";
import { TopPerformersCard } from "@/features/analytics/components/top-performers-card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Analyse dividends, performance, benchmarks, drawdowns and realised returns.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DividendAnalyticsCard />
        <RealisedVsUnrealisedCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BenchmarkComparisonCard />
        <DrawdownAnalysisCard />
      </div>

      <TopPerformersCard />
    </div>
  );
}
