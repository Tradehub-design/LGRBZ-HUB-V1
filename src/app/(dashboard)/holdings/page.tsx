"use client";

import { AssetLogo } from "@/components/workspace/asset-logo";
import { FilterBar } from "@/components/workspace/filter-bar";
import { useWorkspaceSearch } from "@/hooks/useWorkspaceSearch";
import { HoldingDetailCard } from "@/components/workspace/holding-detail-card";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatNumber, formatPercent } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function HoldingsPage() {
  useSeedPortfolio();

  const data = useDashboardData();

  const holdingsSearch = useWorkspaceSearch(
    data.enhancedHoldings,
    (holding) => `${holding.ticker} ${holding.platform} ${holding.sector} ${holding.assetClass} ${holding.country}`,
  );

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Portfolio Core"
        title="Holdings"
        description="Current positions with market valuation, unrealised gain/loss and portfolio weight."
        actions={
          <>
            <WorkspaceLink href="/transactions">Source Ledger</WorkspaceLink>
            <WorkspaceLink href="/portfolio-allocation">Allocation</WorkspaceLink>
            <WorkspaceLink href="/portfolio-health">Health</WorkspaceLink>
          </>
        }
      />

      <FilterBar placeholder="Search holdings..." value={holdingsSearch.query} onChange={holdingsSearch.setQuery} />

      <WorkspaceGrid columns="xl:grid-cols-5">
        <MetricTile label="Open Positions" value={String(data.enhancedHoldings.length)} />
        <MetricTile label="Market Value" value={formatMoney(data.valuation.marketValueAud, 2)} />
        <MetricTile label="Cost Base" value={formatMoney(data.valuation.investedCostAud, 2)} />
        <MetricTile label="Unrealised P/L" value={formatMoney(data.valuation.unrealisedPlAud, 2)} helper={formatPercent(data.valuation.unrealisedPlPercent)} />
        <MetricTile label="Open Lots" value={String(data.fifo.openLots.length)} helper="FIFO lots" />
      </WorkspaceGrid>


      <WorkspacePanel title="Position Cards">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.enhancedHoldings.slice(0, 8).map((holding) => (
            <HoldingDetailCard key={holding.id} holding={holding} />
          ))}
        </div>
      </WorkspacePanel>


      <section className="grid gap-4 xl:grid-cols-[1.55fr_0.65fr]">
        <WorkspacePanel title="Holdings Table">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Holding</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Avg Cost</th>
                  <th className="px-3 py-3 text-right">Market Price</th>
                  <th className="px-3 py-3 text-right">Market Value</th>
                  <th className="px-3 py-3 text-right">Unrealised P/L</th>
                  <th className="px-3 py-3 text-right">Lots</th>
                  <th className="px-3 py-3 text-right">Weight</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {[...holdingsSearch.filteredRows]
                  .sort((a, b) => b.marketValueAud - a.marketValueAud)
                  .map((holding) => {
                    const positive = holding.unrealisedPlAud >= 0;

                    return (
                      <tr key={holding.id} className="text-slate-300 transition hover:bg-slate-800/40">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <AssetLogo symbol={holding.ticker} />
                            <div>
                              <p className="font-semibold text-white">{holding.ticker}</p>
                              <p className="text-[11px] text-slate-500">{holding.sector}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-400">{holding.platform}</td>
                        <td className="px-3 py-3 text-right">{formatNumber(holding.quantity)}</td>
                        <td className="px-3 py-3 text-right">{formatMoney(holding.averageCostAud, 2)}</td>
                        <td className="px-3 py-3 text-right">{formatMoney(holding.marketPriceAud, 2)}</td>
                        <td className="px-3 py-3 text-right font-medium text-white">{formatMoney(holding.marketValueAud, 2)}</td>
                        <td className={positive ? "px-3 py-3 text-right text-emerald-300" : "px-3 py-3 text-right text-rose-300"}>
                          {formatMoney(holding.unrealisedPlAud, 2)}
                          <span className="ml-1 text-slate-500">({formatPercent(holding.unrealisedPlPercent)})</span>
                        </td>
                        <td className="px-3 py-3 text-right text-slate-400">
                          {data.fifo.openLots.filter((lot) => lot.ticker === holding.ticker).length}
                        </td>
                        <td className="px-3 py-3 text-right text-sky-300">{formatPercent(holding.portfolioWeightPercent)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </WorkspacePanel>

        <div className="space-y-4">
          <WorkspacePanel title="Top Holdings">
            <div className="space-y-3">
              {data.topHoldings.slice(0, 8).map((holding) => (
                <div key={holding.id} className="flex items-center gap-3">
                  <AssetLogo symbol={holding.ticker} size="sm" />
                  <div className="min-w-0 flex-1">
                    <ProgressRow
                      label={holding.ticker}
                      value={`${formatPercent(holding.portfolioWeightPercent)} · ${formatMoney(holding.marketValueAud)}`}
                      percent={holding.portfolioWeightPercent}
                    />
                  </div>
                </div>
              ))}
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Unrealised Gain/Loss">
            <div className="space-y-3">
              {[...data.enhancedHoldings]
                .sort((a, b) => Math.abs(b.unrealisedPlAud) - Math.abs(a.unrealisedPlAud))
                .slice(0, 8)
                .map((holding) => (
                  <ProgressRow
                    key={holding.id}
                    label={holding.ticker}
                    value={`${formatMoney(holding.unrealisedPlAud, 2)} · ${formatPercent(holding.unrealisedPlPercent)}`}
                    percent={Math.min(Math.abs(holding.unrealisedPlPercent), 100)}
                    tone={holding.unrealisedPlAud >= 0 ? "emerald" : "rose"}
                  />
                ))}
            </div>
          </WorkspacePanel>
        </div>
      </section>
    </Workspace>
  );
}
