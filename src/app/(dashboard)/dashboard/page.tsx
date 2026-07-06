import { AccountOverviewCard } from "@/features/dashboard/components/account-overview-card";
import { AccountPerformanceTable } from "@/features/dashboard/components/account-performance-table";
import { AllocationCard } from "@/features/dashboard/components/allocation-card";
import { AssetClassCard } from "@/features/dashboard/components/asset-class-card";
import { BenchmarkCard } from "@/features/dashboard/components/benchmark-card";
import { BrokerAllocationCard } from "@/features/dashboard/components/broker-allocation-card";
import { CapitalFlowCard } from "@/features/dashboard/components/capital-flow-card";
import { ContributionCard } from "@/features/dashboard/components/contribution-card";
import { CurrencyExposureCard } from "@/features/dashboard/components/currency-exposure-card";
import { DashboardFooterSummary } from "@/features/dashboard/components/dashboard-footer-summary";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardWarningCard } from "@/features/dashboard/components/dashboard-warning-card";
import { DividendCalendarTable } from "@/features/dashboard/components/dividend-calendar-table";
import { DividendIncomeCard } from "@/features/dashboard/components/dividend-income-card";
import { DrawdownCard } from "@/features/dashboard/components/drawdown-card";
import { EquityCurveCard } from "@/features/dashboard/components/equity-curve-card";
import { FeeSummaryCard } from "@/features/dashboard/components/fee-summary-card";
import { GoalProgressCard } from "@/features/dashboard/components/goal-progress-card";
import { HoldingConcentrationCard } from "@/features/dashboard/components/holding-concentration-card";
import { HoldingTable } from "@/features/dashboard/components/holding-table";
import { IncomeForecastCard } from "@/features/dashboard/components/income-forecast-card";
import { InvestmentRulesCard } from "@/features/dashboard/components/investment-rules-card";
import { LiquidityCard } from "@/features/dashboard/components/liquidity-card";
import { MarketSummaryCard } from "@/features/dashboard/components/market-summary-card";
import { MonthlyPerformanceTable } from "@/features/dashboard/components/monthly-performance-table";
import { PerformanceAttributionTable } from "@/features/dashboard/components/performance-attribution-table";
import { PerformanceBreakdown } from "@/features/dashboard/components/performance-breakdown";
import { PerformanceInsightsCard } from "@/features/dashboard/components/performance-insights-card";
import { PortfolioActionsCard } from "@/features/dashboard/components/portfolio-actions-card";
import { PortfolioHealthCard } from "@/features/dashboard/components/portfolio-health-card";
import { PortfolioNotesCard } from "@/features/dashboard/components/portfolio-notes-card";
import { PortfolioScoreCard } from "@/features/dashboard/components/portfolio-score-card";
import { PositionSizingCard } from "@/features/dashboard/components/position-sizing-card";
import { ProjectionCard } from "@/features/dashboard/components/projection-card";
import { RebalanceCard } from "@/features/dashboard/components/rebalance-card";
import { RecentActivityCard } from "@/features/dashboard/components/recent-activity-card";
import { ReturnQualityCard } from "@/features/dashboard/components/return-quality-card";
import { ReviewChecklistCard } from "@/features/dashboard/components/review-checklist-card";
import { RiskMetricsTable } from "@/features/dashboard/components/risk-metrics-table";
import { RiskSnapshotCard } from "@/features/dashboard/components/risk-snapshot-card";
import { SavingsRateCard } from "@/features/dashboard/components/savings-rate-card";
import { SectorExposureCard } from "@/features/dashboard/components/sector-exposure-card";
import { SummaryCards } from "@/features/dashboard/components/summary-cards";
import { TargetAllocationCard } from "@/features/dashboard/components/target-allocation-card";
import { TaxSummaryCard } from "@/features/dashboard/components/tax-summary-card";
import { TopMoversCard } from "@/features/dashboard/components/top-movers-card";
import { TransactionSummaryTable } from "@/features/dashboard/components/transaction-summary-table";
import { UpcomingEventsCard } from "@/features/dashboard/components/upcoming-events-card";
import { WatchlistCard } from "@/features/dashboard/components/watchlist-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardWarningCard />
      <SummaryCards />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <EquityCurveCard />

        <div className="space-y-6">
          <AllocationCard />
          <PerformanceBreakdown />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AccountOverviewCard />
        <WatchlistCard />
        <RecentActivityCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DividendIncomeCard />
        <RiskSnapshotCard />
        <GoalProgressCard />
        <ContributionCard />
        <SectorExposureCard />
        <BrokerAllocationCard />
        <TopMoversCard />
        <UpcomingEventsCard />
        <AssetClassCard />
        <BenchmarkCard />
        <TaxSummaryCard />
        <PortfolioNotesCard />
        <FeeSummaryCard />
        <IncomeForecastCard />
        <RebalanceCard />
        <DrawdownCard />
        <MarketSummaryCard />
        <CurrencyExposureCard />
        <TargetAllocationCard />
        <InvestmentRulesCard />
        <ReturnQualityCard />
        <PositionSizingCard />
        <PerformanceInsightsCard />
        <CapitalFlowCard />
        <PortfolioScoreCard />
        <HoldingConcentrationCard />
        <SavingsRateCard />
        <ReviewChecklistCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <PortfolioHealthCard />
        <LiquidityCard />
        <PortfolioActionsCard />
      </div>

      <ProjectionCard />
      <PerformanceAttributionTable />
      <RiskMetricsTable />
      <AccountPerformanceTable />
      <TransactionSummaryTable />
      <MonthlyPerformanceTable />
      <DividendCalendarTable />
      <HoldingTable />
      <DashboardFooterSummary />
    </div>
  );
}
