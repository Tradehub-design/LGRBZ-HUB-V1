import { AccountAllocationCard } from "@/features/holdings/components/account-allocation-card";
import { AssetClassAllocationCard } from "@/features/holdings/components/asset-class-allocation-card";
import { CurrencyExposureCard } from "@/features/holdings/components/currency-exposure-card";
import { DividendSummaryCard } from "@/features/holdings/components/dividend-summary-card";
import { ExchangeExposureCard } from "@/features/holdings/components/exchange-exposure-card";
import { HoldingAlertsCard } from "@/features/holdings/components/holding-alerts-card";
import { HoldingsActionsCard } from "@/features/holdings/components/holdings-actions-card";
import { HoldingsFilterBar } from "@/features/holdings/components/holdings-filter-bar";
import { HoldingsFooterSummary } from "@/features/holdings/components/holdings-footer-summary";
import { HoldingsHeader } from "@/features/holdings/components/holdings-header";
import { HoldingsNotesCard } from "@/features/holdings/components/holdings-notes-card";
import { HoldingsPerformanceCard } from "@/features/holdings/components/holdings-performance-card";
import { HoldingsRiskCard } from "@/features/holdings/components/holdings-risk-card";
import { HoldingsSummaryCards } from "@/features/holdings/components/holdings-summary-cards";
import { HoldingsTable } from "@/features/holdings/components/holdings-table";
import { PortfolioWeightTable } from "@/features/holdings/components/portfolio-weight-table";
import { SectorAllocationCard } from "@/features/holdings/components/sector-allocation-card";
import { TopHoldingsCard } from "@/features/holdings/components/top-holdings-card";
import { UnrealisedPnlCard } from "@/features/holdings/components/unrealised-pnl-card";

export default function HoldingsPage() {
  return (
    <div className="space-y-6">
      <HoldingsHeader />
      <HoldingsFilterBar />
      <HoldingsSummaryCards />
      <HoldingsActionsCard />

      <div className="grid gap-6 xl:grid-cols-3">
        <SectorAllocationCard />
        <AccountAllocationCard />
        <TopHoldingsCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AssetClassAllocationCard />
        <HoldingsRiskCard />
        <HoldingsPerformanceCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <CurrencyExposureCard />
        <ExchangeExposureCard />
        <UnrealisedPnlCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DividendSummaryCard />
        <HoldingAlertsCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PortfolioWeightTable />
        <HoldingsNotesCard />
      </div>

      <HoldingsTable />
      <HoldingsFooterSummary />
    </div>
  );
}
