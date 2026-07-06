import { LivePricesFilterBar } from "@/features/live-prices/components/live-prices-filter-bar";
import { LivePricesFooterSummary } from "@/features/live-prices/components/live-prices-footer-summary";
import { LivePricesHeader } from "@/features/live-prices/components/live-prices-header";
import { LivePricesSummaryCards } from "@/features/live-prices/components/live-prices-summary-cards";
import { LivePricesTable } from "@/features/live-prices/components/live-prices-table";
import { MarketStatusCard } from "@/features/live-prices/components/market-status-card";
import { PriceAlertsCard } from "@/features/live-prices/components/price-alerts-card";
import { TopMoversCard } from "@/features/live-prices/components/top-movers-card";
import { WatchlistLiveCard } from "@/features/live-prices/components/watchlist-live-card";

export default function LivePricesPage() {
  return (
    <div className="space-y-6">
      <LivePricesHeader />

      <LivePricesFilterBar />

      <LivePricesSummaryCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <MarketStatusCard />
        <TopMoversCard />
        <WatchlistLiveCard />
      </div>

      <LivePricesTable />

      <PriceAlertsCard />

      <LivePricesFooterSummary />
    </div>
  );
}
