"use client";

import { Star, TrendingUp } from "lucide-react";
import { AssetLogo } from "@/components/workspace/asset-logo";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { DEFAULT_MARKET_WATCHLIST } from "@/lib/market/watchlist";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function MarketWatchlistPage() {
  const symbols = DEFAULT_MARKET_WATCHLIST.map((item) => item.symbol);
  const { quotes, loading } = useMarketQuotes(symbols);

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Market Intelligence"
        title="Market Watchlist"
        description="TradingView-style market watchlist foundation with live quote provider."
        actions={
          <>
            <WorkspaceLink href="/market">Market Centre</WorkspaceLink>
            <WorkspaceLink href="/watchlist">Portfolio Watchlist</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Star />} label="Watchlist Assets" value={String(DEFAULT_MARKET_WATCHLIST.length)} tone="blue" />
        <PremiumStatCard icon={<TrendingUp />} label="Quotes Loaded" value={String(quotes.length)} helper={loading ? "Loading" : "Ready"} tone="green" />
        <PremiumStatCard label="Markets" value="5" helper="ASX / US / Crypto / FX" tone="purple" />
        <PremiumStatCard label="Mode" value="Demo" helper="API provider later" tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="Market Watchlist">
        <div className="overflow-hidden rounded-xl border border-[#173047]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1e30] text-slate-400">
              <tr>
                <th className="px-3 py-3">Asset</th>
                <th className="px-3 py-3">Market</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3 text-right">Price</th>
                <th className="px-3 py-3 text-right">Change</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {DEFAULT_MARKET_WATCHLIST.map((asset) => {
                const quote = quotes.find((item) => item.symbol === asset.symbol);
                const positive = (quote?.change ?? 0) >= 0;

                return (
                  <tr key={asset.symbol} className="text-slate-300 hover:bg-slate-800/40">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <AssetLogo symbol={asset.symbol} />
                        <div>
                          <p className="font-semibold text-white">{asset.symbol}</p>
                          <p className="text-[11px] text-slate-500">{asset.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill tone="blue">{asset.market}</StatusPill>
                    </td>
                    <td className="px-3 py-3 text-slate-400">{asset.category}</td>
                    <td className="px-3 py-3 text-right font-semibold text-white">
                      {quote ? `$${quote.price.toFixed(2)}` : "-"}
                    </td>
                    <td className={positive ? "px-3 py-3 text-right text-emerald-300" : "px-3 py-3 text-right text-rose-300"}>
                      {quote ? `${quote.changePercent.toFixed(2)}%` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
