"use client";

import DashboardHeader from "./DashboardHeader";
import PortfolioSummary from "./PortfolioSummary";
import PortfolioIntelligence from "./PortfolioIntelligence";
import PortfolioTimeline from "./PortfolioTimeline";
import PortfolioHealthCard from "./PortfolioHealthCard";
import CashPositionCard from "./CashPositionCard";
import PortfolioAllocation from "./PortfolioAllocation";
import SectorAllocation from "./SectorAllocation";
import WinnersLosers from "./WinnersLosers";
import LargestPositionCard from "./LargestPositionCard";
import DividendIncomeCard from "./DividendIncomeCard";
import AssetAllocation from "./AssetAllocation";
import PortfolioInsights from "@/components/ai/PortfolioInsights";
import HoldingsTable from "./HoldingsTable";

export default function DashboardGrid() {
  return (
    <div className="mx-auto max-w-[1800px] space-y-6 p-6">
      <DashboardHeader />

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <PortfolioSummary />
        </div>

        <div className="xl:col-span-4">
          <PortfolioHealthCard />
        </div>

        <div className="xl:col-span-4">
          <CashPositionCard />
        </div>

        <div className="xl:col-span-4">
          <LargestPositionCard />
        </div>

        <div className="xl:col-span-4">
          <DividendIncomeCard />
        </div>

        <div className="xl:col-span-6">
          <PortfolioAllocation />
        </div>

        <div className="xl:col-span-6">
          <SectorAllocation />
        </div>

        <div className="xl:col-span-6">
          <WinnersLosers />
        </div>

        <div className="xl:col-span-6">
          <AssetAllocation />
        </div>

        <div className="xl:col-span-6">
          <PortfolioIntelligence />
        </div>

        <div className="xl:col-span-6">
          <PortfolioTimeline />
        </div>

        <div className="xl:col-span-12">
          <PortfolioInsights />
        </div>

        <div className="xl:col-span-12">
          <HoldingsTable />
        </div>
      </div>
    </div>
  );
}
