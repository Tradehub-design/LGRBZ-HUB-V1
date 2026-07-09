"use client";

import BentoGrid from "./layout/BentoGrid";
import PortfolioOverviewWidget from "./widgets/PortfolioOverviewWidget";
import PortfolioIntelligence from "./PortfolioIntelligence";
import PortfolioTimeline from "./PortfolioTimeline";
import KpiStrip from "./widgets/KpiStrip";

export default function DashboardV2() {
  return (
    <div className="space-y-6">
      <KpiStrip />

      <BentoGrid>
        <div className="col-span-12 row-span-2 xl:col-span-8">
          <PortfolioOverviewWidget />
        </div>

        <div className="col-span-12 row-span-2 xl:col-span-4">
          <PortfolioIntelligence />
        </div>

        <div className="col-span-12 row-span-3 xl:col-span-7">
          <div className="h-full rounded-2xl border bg-card p-6">Charts</div>
        </div>

        <div className="col-span-12 row-span-3 xl:col-span-5">
          <PortfolioTimeline />
        </div>
      </BentoGrid>
    </div>
  );
}
