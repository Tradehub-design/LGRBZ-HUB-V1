import { WatchlistActionsCard } from "@/features/watchlist/components/watchlist-actions-card";
import { WatchlistAlertsCard } from "@/features/watchlist/components/watchlist-alerts-card";
import { WatchlistFilterBar } from "@/features/watchlist/components/watchlist-filter-bar";
import { WatchlistFooterSummary } from "@/features/watchlist/components/watchlist-footer-summary";
import { WatchlistHeader } from "@/features/watchlist/components/watchlist-header";
import { WatchlistSectorCard } from "@/features/watchlist/components/watchlist-sector-card";
import { WatchlistStatusCard } from "@/features/watchlist/components/watchlist-status-card";
import { WatchlistSummaryCards } from "@/features/watchlist/components/watchlist-summary-cards";
import { WatchlistTable } from "@/features/watchlist/components/watchlist-table";
import { WatchlistTargetCard } from "@/features/watchlist/components/watchlist-target-card";

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <WatchlistHeader />
      <WatchlistFilterBar />
      <WatchlistSummaryCards />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <WatchlistTable />
        <WatchlistTargetCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <WatchlistSectorCard />
        <WatchlistStatusCard />
        <WatchlistAlertsCard />
      </div>

      <WatchlistActionsCard />
      <WatchlistFooterSummary />
    </div>
  );
}
