"use client";

import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function LivePricesPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Market Engine"
        title="Live Prices"
        description="Market price engine placeholder. Current values use cost basis only; live ASX, US and crypto prices are planned for v2.0."
        actions={
          <>
            <WorkspaceLink href="/watchlist">Watchlist</WorkspaceLink>
            <WorkspaceLink href="/holdings">Holdings</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <MetricTile label="Tracked Holdings" value={String(data.openHoldings.length)} />
        <MetricTile label="Current Valuation" value={formatMoney(data.totalValueAud)} helper="Cost basis mode" />
        <MetricTile label="Unrealised P/L" value="$0" helper="Requires live prices" />
        <MetricTile label="Price Source" value="Pending" helper="v2.0 market API" />
      </WorkspaceGrid>

      <WorkspacePanel title="Price Coverage">
        <div className="overflow-hidden rounded-xl border border-[#173047]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1e30] text-slate-400">
              <tr>
                <th className="px-3 py-3">Ticker</th>
                <th className="px-3 py-3">Asset Class</th>
                <th className="px-3 py-3">Platform</th>
                <th className="px-3 py-3 text-right">Cost Base</th>
                <th className="px-3 py-3 text-right">Weight</th>
                <th className="px-3 py-3">Price Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.topHoldings.map((holding) => (
                <tr key={holding.id} className="text-slate-300 hover:bg-slate-800/40">
                  <td className="px-3 py-3 font-semibold text-white">{holding.ticker}</td>
                  <td className="px-3 py-3 text-slate-400">{holding.assetClass}</td>
                  <td className="px-3 py-3 text-slate-400">{holding.platform}</td>
                  <td className="px-3 py-3 text-right text-white">{formatMoney(holding.totalCostAud)}</td>
                  <td className="px-3 py-3 text-right text-sky-300">{formatPercent(holding.weightPercent)}</td>
                  <td className="px-3 py-3 text-amber-300">Pending API</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
