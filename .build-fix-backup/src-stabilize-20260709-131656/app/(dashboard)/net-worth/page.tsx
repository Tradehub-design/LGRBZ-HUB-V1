"use client";

import { Landmark, MinusCircle, PiggyBank, Wallet } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { ProgressRow } from "@/components/workspace";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney } from "@/lib/portfolio-engine/format";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function NetWorthPage() {
  useSeedPortfolio();
  const data = useDashboardData();
  const netWorth = data.netWorth;

  const totalAssets = netWorth.portfolioAud + netWorth.cashAud + netWorth.otherAssetsAud || 1;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Business Suite"
        title="Net Worth"
        description="Portfolio-based net worth snapshot. External assets and liabilities can be added later."
        actions={
          <>
            <WorkspaceLink href="/business-model">Business Model</WorkspaceLink>
            <WorkspaceLink href="/cashflow-planner">Cashflow</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<Landmark />} label="Net Worth" value={formatMoney(netWorth.netWorthAud)} tone="green" />
        <PremiumStatCard icon={<Wallet />} label="Portfolio" value={formatMoney(netWorth.portfolioAud)} tone="blue" />
        <PremiumStatCard icon={<PiggyBank />} label="Cash" value={formatMoney(netWorth.cashAud)} tone="purple" />
        <PremiumStatCard icon={<MinusCircle />} label="Liabilities" value={formatMoney(netWorth.liabilitiesAud)} tone="rose" />
      </WorkspaceGrid>

      <WorkspacePanel title="Net Worth Breakdown">
        <div className="space-y-4">
          <ProgressRow label="Portfolio" value={formatMoney(netWorth.portfolioAud)} percent={(netWorth.portfolioAud / totalAssets) * 100} tone="sky" />
          <ProgressRow label="Cash" value={formatMoney(netWorth.cashAud)} percent={(netWorth.cashAud / totalAssets) * 100} tone="violet" />
          <ProgressRow label="Other Assets" value={formatMoney(netWorth.otherAssetsAud)} percent={(netWorth.otherAssetsAud / totalAssets) * 100} tone="emerald" />
          <ProgressRow label="Liabilities" value={formatMoney(netWorth.liabilitiesAud)} percent={(netWorth.liabilitiesAud / totalAssets) * 100} tone="rose" />
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
