import { AllocationFooterSummary } from "@/features/portfolio-allocation/components/allocation-footer-summary";
import { AllocationHeader } from "@/features/portfolio-allocation/components/allocation-header";
import { AllocationSummaryCards } from "@/features/portfolio-allocation/components/allocation-summary-cards";
import { AssetAllocationTable } from "@/features/portfolio-allocation/components/asset-allocation-table";
import { CountryAllocationCard } from "@/features/portfolio-allocation/components/country-allocation-card";
import { CurrencyExposureCard } from "@/features/portfolio-allocation/components/currency-exposure-card";
import { RebalanceRecommendationsCard } from "@/features/portfolio-allocation/components/rebalance-recommendations-card";
import { SectorAllocationCard } from "@/features/portfolio-allocation/components/sector-allocation-card";

export default function PortfolioAllocationPage() {
  return (
    <div className="space-y-6">
      <AllocationHeader />
      <AllocationSummaryCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <SectorAllocationCard />
        <CountryAllocationCard />
        <CurrencyExposureCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <AssetAllocationTable />
        <RebalanceRecommendationsCard />
      </div>

      <AllocationFooterSummary />
    </div>
  );
}
