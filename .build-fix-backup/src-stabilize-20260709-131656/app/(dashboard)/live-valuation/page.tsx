"use client";

import { Activity, TrendingUp, Wallet } from "lucide-react";
import { AssetLogo } from "@/components/workspace/asset-logo";
import { MarketDataBanner } from "@/components/market/market-data-banner";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useLivePortfolioValuation } from "@/hooks/useLivePortfolioValuation";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function LiveValuationPage() {
  useSeedPortfolio();
  const data = useLivePortfolioValuation();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Live Portfolio"
        title="Live Valuation"
        description="Portfolio valuation using the market quote provider."
        actions={
          <>
            <WorkspaceLink href="/holdings">Holdings</WorkspaceLink>
            <WorkspaceLink href="/market">Market Centre</WorkspaceLink>
          </>
        }
      />

      <MarketDataBanner />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Wallet />} label="Total Value" value={formatMoney(data.liveValuation.totalValueAud, 2)} tone="blue" />
        <PremiumStatCard icon={<Activity />} label="Market Value" value={formatMoney(data.liveValuation.marketValueAud, 2)} tone="green" />
        <PremiumStatCard icon={<TrendingUp />} label="Unrealised P/L" value={formatMoney(data.liveValuation.unrealisedPlAud, 2)} helper={formatPercent(data.liveValuation.unrealisedPlPercent)} tone={data.liveValuation.unrealisedPlAud >= 0 ? "green" : "rose"} />
        <PremiumStatCard label="Quotes" value={String(data.quotes.length)} helper={data.loading ? "Loading" : "Ready"} tone="purple" />
      </WorkspaceGrid>

      <WorkspacePanel title="Live Holdings">
        <div className="overflow-hidden rounded-xl border border-[#173047]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1e30] text-slate-400">
              <tr>
                <th className="px-3 py-3">Holding</th>
                <th className="px-3 py-3 text-right">Qty</th>
                <th className="px-3 py-3 text-right">Live Price</th>
                <th className="px-3 py-3 text-right">Market Value</th>
                <th className="px-3 py-3 text-right">Unrealised P/L</th>
                <th className="px-3 py-3">Mode</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {data.liveHoldings.map((holding) => (
                <tr key={holding.id} className="text-slate-300">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <AssetLogo symbol={holding.ticker} />
                      <span className="font-semibold text-white">{holding.ticker}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">{holding.quantity}</td>
                  <td className="px-3 py-3 text-right">{formatMoney(holding.marketPriceAud, 2)}</td>
                  <td className="px-3 py-3 text-right font-semibold text-white">{formatMoney(holding.marketValueAud, 2)}</td>
                  <td className={holding.unrealisedPlAud >= 0 ? "px-3 py-3 text-right text-emerald-300" : "px-3 py-3 text-right text-rose-300"}>
                    {formatMoney(holding.unrealisedPlAud, 2)} · {formatPercent(holding.unrealisedPlPercent)}
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill tone={holding.quote?.mode === "live" ? "green" : "amber"}>
                      {holding.quote?.mode ?? "engine"}
                    </StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
