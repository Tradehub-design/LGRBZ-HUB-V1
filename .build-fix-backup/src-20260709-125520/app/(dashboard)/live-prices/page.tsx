"use client";

import { Activity, LineChart, Radio, Wallet } from "lucide-react";
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
        <PremiumStatCard icon={<LineChart />} label="Tracked Holdings" value={String(data.openHoldings.length)} tone="blue" />
        <PremiumStatCard icon={<Wallet />} label="Current Valuation" value={formatMoney(data.totalValueAud)} helper="Cost basis mode" tone="green" />
        <PremiumStatCard icon={<Activity />} label="Unrealised P/L" value="$0" helper="Requires live prices" tone="amber" />
        <PremiumStatCard icon={<Radio />} label="Price Source" value="Pending" helper="v2.0 market API" tone="purple" />
      </WorkspaceGrid>

      <WorkspacePanel title="Price Coverage">
        <PremiumTable>
          <PremiumTableHead>
            <tr>
              <PremiumTh>Ticker</PremiumTh>
              <PremiumTh>Asset Class</PremiumTh>
              <PremiumTh>Platform</PremiumTh>
              <PremiumTh align="right">Cost Base</PremiumTh>
              <PremiumTh align="right">Weight</PremiumTh>
              <PremiumTh>Price Status</PremiumTh>
            </tr>
          </PremiumTableHead>

          <PremiumTableBody>
            {data.topHoldings.map((holding) => (
              <PremiumRow key={holding.id}>
                <PremiumTd strong>
                  <div className="flex items-center gap-3">
                    <AssetLogo symbol={holding.ticker} />
                    {holding.ticker}
                  </div>
                </PremiumTd>
                <PremiumTd>{holding.assetClass}</PremiumTd>
                <PremiumTd>{holding.platform}</PremiumTd>
                <PremiumTd align="right" strong>{formatMoney(holding.totalCostAud)}</PremiumTd>
                <PremiumTd align="right">{formatPercent(holding.weightPercent)}</PremiumTd>
                <PremiumTd>
                  <StatusPill tone="amber">Pending API</StatusPill>
                </PremiumTd>
              </PremiumRow>
            ))}
          </PremiumTableBody>
        </PremiumTable>
      </WorkspacePanel>
    </Workspace>
  );
}
