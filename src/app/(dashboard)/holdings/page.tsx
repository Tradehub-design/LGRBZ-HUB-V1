"use client";

import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
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
import { useDashboardData } from "@/features/dashboard/useDashboardData";

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
        <MetricTile label="Cost Base" value={formatMoney(data.totalCostAud)} />
        <MetricTile label="Cash" value={formatMoney(data.totalCashAud)} />
        <MetricTile label="Dividends" value={formatMoney(data.totalDividendsAud)} />
        <MetricTile label="Realised P/L" value={formatMoney(data.realisedPlAud)} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_0.7fr]">
        <WorkspacePanel title="Holdings Table">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Ticker</th>
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
                      <tr key={holding.id} className="text-slate-300 hover:bg-slate-800/40">
                        <td className="px-3 py-3 font-semibold text-white">{holding.ticker}</td>
                        <td className="px-3 py-3 text-slate-400">{holding.platform}</td>
                        <td className="px-3 py-3">{holding.assetClass}</td>
                        <td className="px-3 py-3 text-slate-400">{holding.sector}</td>
                        <td className="px-3 py-3 text-right">{formatNumber(holding.quantity)}</td>
                        <td className="px-3 py-3 text-right">{formatMoney(holding.averageCostAud)}</td>
                        <td className="px-3 py-3 text-right font-medium text-white">
                          {formatMoney(holding.totalCostAud)}
                        </td>
                        <td className="px-3 py-3 text-right text-sky-300">{formatPercent(weight)}</td>
                      </tr>
                    );
                  })}

                {data.openHoldings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                      No open holdings found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </WorkspacePanel>

        <div className="space-y-4">
          <WorkspacePanel title="Top Holdings">
            <div className="space-y-3">
              {data.topHoldings.slice(0, 8).map((holding) => (
                <ProgressRow
                  key={holding.id}
                  label={holding.ticker}
                  value={`${formatPercent(holding.weightPercent)} · ${formatMoney(holding.totalCostAud)}`}
                  percent={holding.weightPercent}
                />
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
