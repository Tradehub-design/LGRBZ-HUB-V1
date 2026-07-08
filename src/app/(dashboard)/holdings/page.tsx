"use client";

import { AssetLogo } from "@/components/workspace/asset-logo";
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
  const totalCost = data.totalCostAud || 1;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Portfolio Core"
        title="Holdings"
        description="Current positions calculated directly from your transaction ledger."
        actions={
          <>
            <WorkspaceLink href="/transactions">Source Ledger</WorkspaceLink>
            <WorkspaceLink href="/portfolio-allocation">Allocation</WorkspaceLink>
            <WorkspaceLink href="/portfolio-health">Health</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-5">
        <MetricTile label="Open Positions" value={String(data.openHoldings.length)} />
        <MetricTile label="Cost Base" value={formatMoney(data.totalCostAud, 2)} />
        <MetricTile label="Cash" value={formatMoney(data.totalCashAud, 2)} />
        <MetricTile label="Dividends" value={formatMoney(data.totalDividendsAud, 2)} />
        <MetricTile label="Realised P/L" value={formatMoney(data.realisedPlAud, 2)} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1.55fr_0.65fr]">
        <WorkspacePanel title="Holdings Table">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Holding</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3">Asset</th>
                  <th className="px-3 py-3">Sector</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Avg Cost</th>
                  <th className="px-3 py-3 text-right">Cost Base</th>
                  <th className="px-3 py-3 text-right">Weight</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {[...data.openHoldings]
                  .sort((a, b) => b.totalCostAud - a.totalCostAud)
                  .map((holding) => {
                    const weight = (holding.totalCostAud / totalCost) * 100;

                    return (
                      <tr key={holding.id} className="text-slate-300 transition hover:bg-slate-800/40">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <AssetLogo symbol={holding.ticker} />
                            <div>
                              <p className="font-semibold text-white">{holding.ticker}</p>
                              <p className="text-[11px] text-slate-500">{holding.country}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-400">{holding.platform}</td>
                        <td className="px-3 py-3">{holding.assetClass}</td>
                        <td className="px-3 py-3 text-slate-400">{holding.sector}</td>
                        <td className="px-3 py-3 text-right">{formatNumber(holding.quantity)}</td>
                        <td className="px-3 py-3 text-right">{formatMoney(holding.averageCostAud, 2)}</td>
                        <td className="px-3 py-3 text-right font-medium text-white">
                          {formatMoney(holding.totalCostAud, 2)}
                        </td>
                        <td className="px-3 py-3 text-right text-sky-300">{formatPercent(weight)}</td>
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
                      value={`${formatPercent(holding.weightPercent)} · ${formatMoney(holding.totalCostAud)}`}
                      percent={holding.weightPercent}
                    />
                  </div>
                </div>
              ))}
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Risk Split">
            <div className="space-y-3">
              {data.allocation.risk.slice(0, 6).map((item) => (
                <ProgressRow
                  key={item.label}
                  label={item.label}
                  value={`${formatPercent(item.percent)} · ${formatMoney(item.value)}`}
                  percent={item.percent}
                  tone={item.label.toLowerCase().includes("high") ? "rose" : "sky"}
                />
              ))}
            </div>
          </WorkspacePanel>
        </div>
      </section>
    </Workspace>
  );
}
