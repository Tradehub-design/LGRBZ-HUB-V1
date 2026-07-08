"use client";

import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

const watchlist = [
  { symbol: "VAS.AX", name: "Vanguard Australian Shares ETF", theme: "Australian Core" },
  { symbol: "IVV.AX", name: "iShares S&P 500 ETF", theme: "US Core" },
  { symbol: "NDQ.AX", name: "BetaShares Nasdaq 100 ETF", theme: "Growth" },
  { symbol: "BHP.AX", name: "BHP Group", theme: "Resources" },
  { symbol: "NAB.AX", name: "National Australia Bank", theme: "Banks" },
  { symbol: "BTC", name: "Bitcoin", theme: "Crypto" },
];

export default function WatchlistPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Market Workspace"
        title="Watchlist"
        description="Track investment ideas, existing exposure and future opportunities. Live prices connect in v2.0."
        actions={
          <>
            <WorkspaceLink href="/live-prices">Live Prices</WorkspaceLink>
            <WorkspaceLink href="/holdings">Holdings</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <MetricTile label="Watchlist Items" value={String(watchlist.length)} />
        <MetricTile label="Current Holdings" value={String(data.openHoldings.length)} />
        <MetricTile label="High Risk Exposure" value={formatPercent(data.risk.highRiskPercent)} />
        <MetricTile label="Cash Available" value={formatMoney(data.totalCashAud)} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <WorkspacePanel title="Watchlist">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Symbol</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Theme</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {watchlist.map((item) => {
                  const held = data.openHoldings.some((holding) => holding.ticker.replace("ASX:", "") === item.symbol.replace(".AX", ""));
                  return (
                    <tr key={item.symbol} className="text-slate-300 hover:bg-slate-800/40">
                      <td className="px-3 py-3 font-semibold text-white">{item.symbol}</td>
                      <td className="px-3 py-3 text-slate-400">{item.name}</td>
                      <td className="px-3 py-3">{item.theme}</td>
                      <td className="px-3 py-3">
                        <span className={held ? "text-emerald-300" : "text-sky-300"}>
                          {held ? "Held" : "Watching"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Current Exposure">
          <div className="space-y-3">
            {data.allocation.assetClass.map((item) => (
              <ProgressRow key={item.label} label={item.label} value={formatPercent(item.percent)} percent={item.percent} />
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
