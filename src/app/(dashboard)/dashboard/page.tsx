import { AccountOverviewCard } from "@/features/dashboard/components/account-overview-card";
import { AllocationCard } from "@/features/dashboard/components/allocation-card";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { EquityCurveCard } from "@/features/dashboard/components/equity-curve-card";
import { HoldingTable } from "@/features/dashboard/components/holding-table";
import { PerformanceBreakdown } from "@/features/dashboard/components/performance-breakdown";
import { RecentActivityCard } from "@/features/dashboard/components/recent-activity-card";
import { SummaryCards } from "@/features/dashboard/components/summary-cards";
import { WatchlistCard } from "@/features/dashboard/components/watchlist-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
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

      <HoldingTable />
    </div>
  );
}
