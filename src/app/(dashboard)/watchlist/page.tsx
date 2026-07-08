"use client";

import { Eye, LineChart, Shield, Wallet } from "lucide-react";
import { AssetLogo } from "@/components/workspace/asset-logo";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import {
  PremiumRow,
  PremiumTable,
  PremiumTableBody,
  PremiumTableHead,
  PremiumTd,
  PremiumTh,
} from "@/components/workspace/premium-table";
import { StatusPill } from "@/components/workspace/status-pill";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
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
        <PremiumStatCard icon={<Eye />} label="Watchlist Items" value={String(watchlist.length)} tone="blue" />
        <PremiumStatCard icon={<LineChart />} label="Current Holdings" value={String(data.openHoldings.length)} tone="green" />
        <PremiumStatCard icon={<Shield />} label="High Risk Exposure" value={formatPercent(data.risk.highRiskPercent)} tone="amber" />
        <PremiumStatCard icon={<Wallet />} label="Cash Available" value={formatMoney(data.totalCashAud)} tone="purple" />
      </WorkspaceGrid>


      <WorkspacePanel title="Intelligent Watchlist Ideas">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {data.watchlistIdeas.map((idea) => (
            <div key={idea.symbol} className="rounded-xl border border-[#173047] bg-[#0b1e30] p-4">
              <div className="flex items-center gap-3">
                <AssetLogo symbol={idea.symbol} />
                <div>
                  <p className="font-semibold text-white">{idea.symbol}</p>
                  <p className="text-xs text-slate-500">{idea.theme}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300">{idea.name}</p>
              <p className="mt-2 text-xs text-slate-500">{idea.reason}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">{idea.priority}</p>
            </div>
          ))}
        </div>
      </WorkspacePanel>


      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <WorkspacePanel title="Watchlist">
          <PremiumTable>
            <PremiumTableHead>
              <tr>
                <PremiumTh>Symbol</PremiumTh>
                <PremiumTh>Name</PremiumTh>
                <PremiumTh>Theme</PremiumTh>
                <PremiumTh>Status</PremiumTh>
              </tr>
            </PremiumTableHead>

            <PremiumTableBody>
              {watchlist.map((item) => {
                const held = data.openHoldings.some(
                  (holding) => holding.ticker.replace("ASX:", "") === item.symbol.replace(".AX", ""),
                );

                return (
                  <PremiumRow key={item.symbol}>
                    <PremiumTd strong>
                      <div className="flex items-center gap-3">
                        <AssetLogo symbol={item.symbol} />
                        {item.symbol}
                      </div>
                    </PremiumTd>
                    <PremiumTd>{item.name}</PremiumTd>
                    <PremiumTd>{item.theme}</PremiumTd>
                    <PremiumTd>
                      <StatusPill tone={held ? "green" : "blue"}>{held ? "Held" : "Watching"}</StatusPill>
                    </PremiumTd>
                  </PremiumRow>
                );
              })}
            </PremiumTableBody>
          </PremiumTable>
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
