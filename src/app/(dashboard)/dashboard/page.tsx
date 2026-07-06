import { AllocationCard } from "@/features/dashboard/components/allocation-card";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { EquityCurveCard } from "@/features/dashboard/components/equity-curve-card";
import { HoldingTable } from "@/features/dashboard/components/holding-table";
import { SummaryCards } from "@/features/dashboard/components/summary-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <SummaryCards />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <EquityCurveCard />
        <AllocationCard />
      </div>

      <HoldingTable />
    </div>
  );
}
