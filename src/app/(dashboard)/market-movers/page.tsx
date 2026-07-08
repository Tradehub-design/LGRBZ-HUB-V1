"use client";

import { MarketDataBanner } from "@/components/market/market-data-banner";
import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AssetLogo } from "@/components/workspace/asset-logo";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { DEFAULT_MARKET_WATCHLIST } from "@/lib/market/watchlist";
import { buildMarketMovers } from "@/lib/market/movers";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function MarketMoversPage() {
  const { quotes } = useMarketQuotes(DEFAULT_MARKET_WATCHLIST.map((item) => item.symbol));
  const movers = buildMarketMovers(quotes);

  const gainers = movers.filter((item) => item.direction === "up");
  const losers = movers.filter((item) => item.direction === "down");

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Market Intelligence"
        title="Market Movers"
        description="Top gainers and losers from the market quote provider."
        actions={
          <>
            <WorkspaceLink href="/market-watchlist">Watchlist</WorkspaceLink>
            <WorkspaceLink href="/market">Market Centre</WorkspaceLink>
          </>
        }
      />

      <MarketDataBanner />

      <WorkspaceGrid columns="xl:grid-cols-3">
        <PremiumStatCard icon={<Activity />} label="Quotes" value={String(quotes.length)} tone="blue" />
        <PremiumStatCard icon={<ArrowUpRight />} label="Gainers" value={String(gainers.length)} tone="green" />
        <PremiumStatCard icon={<ArrowDownRight />} label="Losers" value={String(losers.length)} tone="rose" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Top Gainers">
          <div className="space-y-3">
            {gainers.slice(0, 8).map((quote) => (
              <MoverRow key={quote.symbol} quote={quote} />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Top Losers">
          <div className="space-y-3">
            {losers.slice(0, 8).map((quote) => (
              <MoverRow key={quote.symbol} quote={quote} />
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function MoverRow({ quote }: { quote: ReturnType<typeof buildMarketMovers>[number] }) {
  const positive = quote.change >= 0;

  return (
    <div className="flex items-center justify-between rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <div className="flex items-center gap-3">
        <AssetLogo symbol={quote.symbol} />
        <div>
          <p className="font-semibold text-white">{quote.symbol}</p>
          <p className="text-xs text-slate-500">{quote.updatedAt}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-white">${quote.price.toFixed(2)}</p>
        <p className={positive ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>
          {quote.changePercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
