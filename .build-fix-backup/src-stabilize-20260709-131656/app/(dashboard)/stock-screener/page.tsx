"use client";

import { MarketDataBanner } from "@/components/market/market-data-banner";
import { Filter, Search } from "lucide-react";
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
import { buildDemoScreener } from "@/lib/market/screener";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function StockScreenerPage() {
  const rows = buildDemoScreener();
  const buyWatch = rows.filter((row) => row.signal === "Buy Watch").length;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Market Intelligence"
        title="Stock Screener"
        description="Screen watchlist assets by quality, signal and category. Real fundamentals connect later."
        actions={
          <>
            <WorkspaceLink href="/market-watchlist">Watchlist</WorkspaceLink>
            <WorkspaceLink href="/company">Company Research</WorkspaceLink>
          </>
        }
      />

      <MarketDataBanner />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Search />} label="Screened Assets" value={String(rows.length)} tone="blue" />
        <PremiumStatCard icon={<Filter />} label="Buy Watch" value={String(buyWatch)} tone="green" />
        <PremiumStatCard label="Markets" value="ASX / US / Crypto" tone="purple" />
        <PremiumStatCard label="Mode" value="Demo" helper="Fundamentals later" tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="Screener Results">
        <PremiumTable>
          <PremiumTableHead>
            <tr>
              <PremiumTh>Asset</PremiumTh>
              <PremiumTh>Market</PremiumTh>
              <PremiumTh>Category</PremiumTh>
              <PremiumTh align="right">Score</PremiumTh>
              <PremiumTh>Signal</PremiumTh>
            </tr>
          </PremiumTableHead>

          <PremiumTableBody>
            {rows.map((row) => (
              <PremiumRow key={row.symbol}>
                <PremiumTd strong>
                  <div className="flex items-center gap-3">
                    <AssetLogo symbol={row.symbol} />
                    <div>
                      <p>{row.symbol}</p>
                      <p className="text-xs font-normal text-slate-500">{row.name}</p>
                    </div>
                  </div>
                </PremiumTd>
                <PremiumTd>{row.market}</PremiumTd>
                <PremiumTd>{row.category}</PremiumTd>
                <PremiumTd align="right" strong>{row.score}</PremiumTd>
                <PremiumTd>
                  <StatusPill tone={row.signal === "Buy Watch" ? "green" : row.signal === "Hold Watch" ? "amber" : "rose"}>
                    {row.signal}
                  </StatusPill>
                </PremiumTd>
              </PremiumRow>
            ))}
          </PremiumTableBody>
        </PremiumTable>
      </WorkspacePanel>
    </Workspace>
  );
}
